python -m virtualenv env
if (Test-Path "./env") {
	./env/Scripts/activate
	pip install tensorflow
}