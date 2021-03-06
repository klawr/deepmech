cmake_minimum_required(VERSION 3.18)

project(deepmech_cxx LANGUAGES CXX)

include(GenerateExportHeader)

find_package(frugally-deep REQUIRED)
find_package(OpenCV REQUIRED)
find_package(Eigen3 CONFIG REQUIRED)
find_package(fmt CONFIG REQUIRED)
find_package(nlohmann_json CONFIG REQUIRED)

set(CMAKE_INCLUDE_CURRENT_DIR 1)
set(CMAKE_CXX_VISIBILITY_PRESET hidden)
set(CMAKE_VISIBILITY_INLINES_HIDDEN 1)

# add_executable(deepmech_cxx src/deepmech.cpp)
add_library(deepmech_cxx SHARED src/deepmech.cpp)
target_link_libraries(deepmech_cxx PUBLIC frugally-deep::fdeep ${OpenCV_LIBS})
target_link_directories(deepmech_cxx PUBLIC ${OpenCV_INCLUDE_DIRS})
target_link_libraries(deepmech_cxx PUBLIC Eigen3::Eigen fmt::fmt nlohmann_json::nlohmann_json)

target_compile_features(deepmech_cxx PUBLIC cxx_std_20)

generate_export_header(deepmech_cxx)

file(COPY src/assets DESTINATION ${CMAKE_BINARY_DIR})

if (WIN32)
	target_compile_definitions(deepmech_cxx
	PUBLIC
	VC_EXTRALEAN=1
	WIN32_LEAN_AND_MEAN=1
	NOMINMAX=1
)
endif()
