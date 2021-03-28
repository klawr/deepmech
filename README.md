# deepmech

This is a [Monorepo](https://en.wikipedia.org/wiki/Monorepo) for different projects and reports which revolve around deepmech.
deepmech aims to bring automatic detection kinematic structures available on different platforms.

The training data used can be found [here](https://drive.google.com/drive/folders/1yoHZQDhcwV1fuU5Lrqj6s9_T_qJfhMJT?usp=sharing).  
Trained models can be found [here](https://drive.google.com/drive/folders/1Y7L3aUopblxOBmcKRYSEwN57O9a1yu-N?usp=sharing).

The first steps were to detect symbols used for mechanical linkage sketches to learn about the basics of detection algorithms.
The respective project can be reviewed in the [student research project](reports/srp).

After initial experiments using symbols, the resulting models are used to detect constraints.
The detection of symbols (nodes) and constraints allowed for the first detection of mechanical linkages.
The results of these advances were subsequently presented on the IFTOMM-D-A-CH 2020 in Lienz, Austria.
The respective (german) report is located [here](reports/iftomm_dach).

The third project revolves around bringing created applications to different platforms.
The respective project can be reviewed in the [student engineering project](reports/sep).

## Project Organization

    ├── LICENSE
    ├── README.md             <- The top-level README
    ├── data
    │    ├── interim          <- Intermediate data that has been transformed.
    │    ├── processed        <- The final, canonical data sets for modeling.
    │    └── raw              <- The original, immutable data dump.
    │
    ├── logs                  <- TensorBoard logs. Runs are distributed in ISO8601 format.
    │
    ├── models                <- Trained and serialized models, model predictions, or model    summaries.
    │
    ├── reports               <- Generated analysis as HTML, PDF, LaTeX, etc.
    │    │                       Please refer to the respective folder for more details.
    │    ├── srp              <- Student Research Project.
    │    ├── sep              <- Student Engineering Project. (wip)
    │    └── iftomm_dach      <- Submission for the IFTOMM-D-A-CH   2020
    │
    ├── requirements.txt      <- The requirements file for reproducing the analysis   environment.
    │
    └── src                   <- Source code for use in this project.
         ├── data             <- Scripts to download or generate data
         │     └── cluster_colors.py  - Script to transform gray-scale images to bw
         │     └── invert_colors.py   - Small script if cluster_colors got it wrong.
         │
         └── utils.py         <- Helper functions to distribute data and log results.
                                 These methods ensure that the raw data is never touched,
                                 the intermediate data is accessible and the processed data
                                 can be fed into the model in an orderly way.

---

<p><small>Project based on the <a target="_blank" href="https://drivendata.github.io/cookiecutter-data-science/">cookiecutter data science project template</a>. #cookiecutterdatascience</small></p>
