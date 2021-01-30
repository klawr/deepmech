#include <ranges>

#include <Eigen/Core>
#include <fdeep/fdeep.hpp>
#include <fmt/format.h>
#include <nlohmann/json.hpp>
#include <opencv2/opencv.hpp>

#include <deepmech_cc_export.h>

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
    Node const *p1;
    Node const *p2;
    std::string id;

    auto toJson() const
    {
        nlohmann::json json;
        json["id"] = id;
        json["p1"] = p1->id;
        json["p2"] = p2->id;
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

    std::ranges::sort(proposalList, [](auto const &l, auto const &r) {
        return l.confidence > r.confidence;
    });

    for (auto idx = 0; idx < proposalList.size(); ++idx)
    {
        for (auto jdx = idx + 1; jdx < proposalList.size(); ++jdx)
        {
            if (std::abs(proposalList[idx].x - proposalList[jdx].x) < 16 &&
                std::abs(proposalList[idx].y - proposalList[jdx].y) < 16)
            {
                proposalList.erase(proposalList.begin() + jdx--);
            }
        }
    }

    return proposalList;
}

auto getConstraints(fdeep::model const &crop_detector,
                    cv::Mat const &image,
                    std::vector<Node> const &filtered)
{
    std::vector<Crop> crops;

    for (auto &node1 : filtered)
    {
        for (auto &node2 : filtered)
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

            crop.p1 = &node1;
            crop.p2 = &node2;
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

auto getMec2Json(std::vector<Node> const &n, std::vector<Crop> const &c)
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

struct DeepmechModel
{
    fdeep::model model;

    DeepmechModel(std::string path)
    try : model(fdeep::load_model(path, false, fdeep::dev_null_logger))
    {
    }
    catch (...)
    {
        throw std::invalid_argument(
                fmt::format("Path {} contains no model.", path));
    }
};

const DeepmechModel symbol_detector("assets/fcn_sym_det.json");
const DeepmechModel crop_detector("assets/crop_detector.json");

extern "C" DEEPMECH_CC_EXPORT auto
predict(std::uint8_t *ptr, std::uint32_t width, std::uint32_t height) -> char *
{
    cv::Mat image(height, width, CV_8UC1, ptr);

    const auto nodes = getNodes(symbol_detector.model, image);
    const auto constraints = getConstraints(crop_detector.model, image, nodes);

    auto serialized = getMec2Json(nodes, constraints).dump();

    auto allocation = new char[serialized.size() + 1];
    std::memcpy(allocation, serialized.data(), serialized.size() + 1);

    return allocation;
}

extern "C" DEEPMECH_CC_EXPORT void deepmech_cc_free(char *str)
{
    delete[] str;
}

//int main()
//{
//    auto image = cv::imread("assets/0_0_2.png", 0);
//    //cv::bitwise_not(image, image);
//    cv::imwrite("assets/r.png", image);
//    auto crop =
//            fdeep::tensor_from_bytes(image.ptr(),
//                                     static_cast<std::size_t>(image.rows),
//                                     static_cast<std::size_t>(image.cols),
//                                     static_cast<std::size_t>(image.channels()),
//                                     0.0f,
//                                     1.0f);
//    auto a = crop_detector.model.predict({crop})[0];
//    return 0;
//}
