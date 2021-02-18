#include <ranges>

#include <Eigen/Core>
#include <fdeep/fdeep.hpp>
#include <fmt/format.h>
#include <nlohmann/json.hpp>
#include <opencv2/opencv.hpp>

#include <deepmech_cxx_export.h>

struct Node
{
    std::string id;
    float confidence;
    int x;
    int y;
    bool base;

    auto toJson() const
    {
        nlohmann::json json;
        json["id"] = id;
        json["x"] = x;
        json["y"] = y;
        json["base"] = base;

        return json;
    }

    Node(int X, int Y, std::string Id)
        : confidence{2}
        , x{X}
        , y{Y}
        , id{Id} {};

    Node(float c, bool b, int X, int Y, std::string Id)
        : id{Id}
        , confidence{c}
        , x{X}
        , y{Y}
        , base{b} {};

    Node() = default;
};

struct Crop
{
    cv::Mat image;
    bool const_length;
    bool const_angle;
    std::string p1;
    std::string p2;
    std::string id;

    auto toJson() const
    {
        nlohmann::json json;
        json["id"] = id;
        json["p1"] = p1;
        json["p2"] = p2;
        nlohmann::json ori;
        ori["type"] = const_angle ? "const" : "free";
        json["ori"] = ori;
        nlohmann::json len;
        len["type"] = const_length ? "const" : "free";
        json["len"] = len;

        return json;
    }

    Crop() = default;
};

auto getNodes(fdeep::model const &symbol_detector, cv::Mat const &image)
{
    const auto image_tensor =
            fdeep::tensor_from_bytes(image.ptr(),
                                     static_cast<std::size_t>(image.rows),
                                     static_cast<std::size_t>(image.cols),
                                     static_cast<std::size_t>(image.channels()),
                                     0.0f,
                                     1.0f);

    const auto pred = symbol_detector.predict({image_tensor})[0];

    std::vector<Node> proposalList;
    for (int y = 0; y < pred.height(); ++y)
    {
        for (int x = 0; x < pred.width(); ++x)
        {
            auto max_idx = 0;
            auto max_value = pred.get(fdeep::tensor_pos(y, x, 0));
            for (int z = 1; z < pred.depth(); ++z)
            {
                auto val = pred.get(fdeep::tensor_pos(y, x, z));
                if (val > max_value)
                {
                    max_idx = z;
                    max_value = val;
                }
            }
            if (max_idx != 0)
            {
                auto id = fmt::format("n{}", proposalList.size() + 1);
                proposalList.push_back(
                        Node(max_value, max_idx != 1, (x * 4), (y * 4), id));
            }
        }
    }

    return proposalList;
}

auto getConstraints(fdeep::model const &crop_detector,
                    cv::Mat const &image,
                    std::vector<Node> const &nodes) -> std::vector<Crop>
{
    std::vector<Crop> crops;

    for (auto &node1 : nodes)
    {
        for (auto &node2 : nodes)
        {
            if (&node1 == &node2)
                continue;
            auto x1 = std::min(node1.x, node2.x);
            auto y1 = std::min(node1.y, node2.y);
            auto x2 = std::max(node1.x, node2.x);
            auto y2 = std::max(node1.y, node2.y);

            // 1 dimensional Crops make no sense.
            if (x1 == x2 || y1 == y2)
                continue;

            cv::Mat copy;
            image.copyTo(copy);
            Crop crop{};

            crop.image = copy(cv::Rect(x1 + 16, y1 + 16, x2 - x1, y2 - y1));
            cv::resize(crop.image, crop.image, cv::Size(96, 96));

            if (x1 == node2.x)
            {
                cv::flip(crop.image, crop.image, 1);
            }
            if (y1 == node2.y)
            {
                cv::flip(crop.image, crop.image, 0);
            }

            cv::bitwise_not(crop.image, crop.image);

            crop.p1 = node1.id;
            crop.p2 = node2.id;
            crop.id = node1.id + node2.id;

            crops.push_back(std::move(crop));
        }
    }

    fdeep::tensors_vec crop_tensor;
    for (auto &crop : crops)
    {
        crop_tensor.push_back({fdeep::tensor_from_bytes(
                crop.image.ptr(),
                static_cast<std::size_t>(crop.image.rows),
                static_cast<std::size_t>(crop.image.cols),
                static_cast<std::size_t>(crop.image.channels()),
                0.0f,
                1.0f)});
    }

    auto labels = crop_detector.predict_multi(crop_tensor, true);

    for (auto i = 0; i < labels.size(); ++i)
    {
        auto label = labels[i].front();
        auto max_value = 0.0f;
        auto max_idx = 0;
        for (auto j = 0; j < label.depth(); ++j)
        {
            auto value = label.get(fdeep::tensor_pos(j));
            if (max_value < value)
            {
                max_value = value;
                max_idx = j;
            };
        }

        crops[i].const_angle = max_idx == 2;
        crops[i].const_length = max_idx == 1;
    }

    return crops;
}

// Predicted nodes gets sorted here -> Evil in place changes may occur
auto filteredNodes(std::vector<Node> const &predicted_nodes,
                   std::vector<Node> const &known_nodes) -> std::vector<Node>
{
    std::vector<Node> nodes;
    nodes.reserve(known_nodes.size() + predicted_nodes.size());
    nodes.insert(nodes.end(), known_nodes.begin(), known_nodes.end());
    auto predictionBegin = nodes.insert(
            nodes.end(), predicted_nodes.begin(), predicted_nodes.end());
    std::ranges::sort(
            predictionBegin, nodes.end(), [](auto const &l, auto const &r) {
                return l.confidence > r.confidence;
            });

    auto end = nodes.end();
    for (auto it = nodes.begin(); it != end; ++it)
    {
        end = std::remove_if(std::next(it), end, [&it](auto const &other) {
            return std::abs(it->x - other.x) < 16 &&
                   std::abs(it->y - other.y) < 16;
        });
    }
    nodes.erase(end, nodes.end());

    return nodes;
}

auto getMec2Json(std::vector<Node> const &n, std::vector<Crop> const &c)
        -> nlohmann::json
{
    nlohmann::json nodes;
    for (auto &node : n)
    {
        nodes.push_back(node.toJson());
    }
    nlohmann::json constraints;
    for (auto &crop : c)
    {
        if (crop.const_angle == true || crop.const_length == true)
        {
            constraints.push_back(crop.toJson());
        }
    }

    nlohmann::json json;
    json["nodes"] = nodes;
    json["constraints"] = constraints;

    return json;
}

struct Deepmech_ctx
{
    fdeep::model symbol_detector;
    fdeep::model crop_detector;

    Deepmech_ctx(char *symbolModel, char *cropModel)
        : symbol_detector(fdeep::read_model_from_string(symbolModel))
        , crop_detector(fdeep::read_model_from_string(cropModel))
    {
    }

    Deepmech_ctx(std::string symbolModel_path, std::string cropModel_path)
        : symbol_detector(fdeep::load_model(symbolModel_path, false))
        , crop_detector(fdeep::load_model(cropModel_path, false))
    {
    }

    auto predict(std::uint8_t *ptr,
                 std::uint32_t width,
                 std::uint32_t height,
                 char const *nodes_str) const -> char *
    {
        cv::Mat image(height, width, CV_8UC1, ptr);

        auto json = nlohmann::json::parse(nodes_str);
        std::vector<Node> known_nodes;
        known_nodes.reserve(json.size());
        for (auto &o : json)
        {
            known_nodes.push_back(Node(o["x"], o["y"], o["id"]));
        }

        auto predicted_nodes = getNodes(symbol_detector, image);

        auto nodes = filteredNodes(predicted_nodes, known_nodes);

        const auto constraints = getConstraints(crop_detector, image, nodes);

        // previously known_nodes are 200% confident that they exist already.
        nodes.erase(nodes.begin(),
                    std::ranges::find_if(nodes, [](auto const &v) {
                        return v.confidence <= 1.f;
                    }));

        auto serialized = getMec2Json(nodes, constraints).dump();

        auto allocation = new char[serialized.size() + 1];
        std::memcpy(allocation, serialized.data(), serialized.size() + 1);

        return allocation;
    }
};

extern "C" DEEPMECH_CXX_EXPORT auto create_deepmech_ctx(char *symbolModel,
                                                        char *cropModel)
        -> Deepmech_ctx *
{
    return new Deepmech_ctx(symbolModel, cropModel);
}

extern "C" DEEPMECH_CXX_EXPORT auto predict(Deepmech_ctx *ctx,
                                            std::uint8_t *ptr,
                                            std::uint32_t width,
                                            std::uint32_t height,
                                            const char *nodes) -> char *
{
    return ctx->predict(ptr, width, height, nodes);
}

extern "C" DEEPMECH_CXX_EXPORT void deepmech_cxx_free(char *str)
{
    delete[] str;
}

// int main()
//{
//    // auto image = cv::imread("assets/0_0_2.png", 0);
//    std::string str = R"([
//        {"id": "A0", "x": 100, "y": 900},
//        {"id": "B0", "x": 300, "y": 900},
//        {"id": "A", "x": 100, "y": 850},
//        {"id": "B", "x": 350, "y": 780},
//        {"id": "C", "x": 225, "y": 750},
//        {"id": "C0", "x": 450, "y": 900}
//    ])";
//    Deepmech_ctx ctx("assets/fcn_sym_det.json", "assets/crop_detector.json");
//
//    ctx.predict(nullptr, 0, 0, str.c_str());
//
//    return 0;
//}
