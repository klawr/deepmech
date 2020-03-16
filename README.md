deepmech
==============================

A short description of the project.

Project Organization
------------

    ├── LICENSE
    ├── README.md          <- The top-level README for developers using this project.
    ├── data
    │   ├── interim        <- Intermediate data that has been transformed.
    │   ├── processed      <- The final, canonical data sets for modeling.
    │   └── raw            <- The original, immutable data dump.
    │
    ├── logs               <- TensorBoard logs. Runs are distributed in ISO8601 format.
    │
    ├── models             <- Trained and serialized models, model predictions, or model summaries.
    │
    ├── reports            <- Generated analysis as HTML, PDF, LaTeX, etc.
    │   └── srp            <- Student Research Project.
    │                         Please refer to the srp folder for more details.    
    │
    ├── requirements.txt   <- The requirements file for reproducing the analysis environment.
    │
    └── src                <- Source code for use in this project.
        ├── data           <- Scripts to download or generate data
        │   └── make_dataset.py
        │
        ├── features       <- Scripts to turn raw data into features for modeling
        │   └── build_features.py
        │
        ├── models         <- Scripts to train models and then use trained models to make
        │   │                 predictions
        │   ├── predict_model.py
        │   └── train_model.py
        │
        └── visualization  <- Scripts to create exploratory and results oriented visualizations
        │   └── visualize.py
        └── utils.py       <- Helper functions to distribute data and log results. 
                              These methods ensure that the raw data is never touched,
                              the intermediate data is accessible and the processed data
                              can be fed into the model in an orderly way.


--------

<p><small>Project based on the <a target="_blank" href="https://drivendata.github.io/cookiecutter-data-science/">cookiecutter data science project template</a>. #cookiecutterdatascience</small></p>