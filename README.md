deepmech
==============================

This is a monorepository for different projects and reports which revolve around deepmech.
deepmech is a project which aims to bring automatic detection kinematic structures available on different platforms.

The training data for these projects can be found [here](https://drive.google.com/drive/folders/1yZI5v3ws3b8GZMl_ACe4TO_qebdS2fUz?usp=sharing).

The first steps were done by detecting symbols used in mechanical drawings.
This simple start allowed to learn about the basics of detection algorithms.
The project can be reviewed in the respective [directory](reports/srp).

After initial experiments using symbols, the resulting models are used to detect contraints, too.
The detection of symbols (nodes) and constraints allowed for the first detection of mechanical linkages.
The results of these advances were subsequentially presented on the IFTOMM-D-A-CH 2020 in Lienz, Austria.
The respective (german) report is located [here](reports/iftomm_dach).

The third project revolves around bringing the applications on to different platforms.
The respective student engineering project (sep) is a work in progress and will be updated.

Project Organization
------------

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
         │     └── cluster_colors.py  - Script to transform grayscale images to bw
         │     └── invert_colors.py   - Small script if cluster_colors got it wrong.
         │
         └── utils.py         <- Helper functions to distribute data and log results. 
                                 These methods ensure that the raw data is never touched,
                                 the intermediate data is accessible and the processed data
                                 can be fed into the model in an orderly way.


--------

<p><small>Project based on the <a target="_blank" href="https://drivendata.github.io/cookiecutter-data-science/">cookiecutter data science project template</a>. #cookiecutterdatascience</small></p>
