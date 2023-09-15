from app import init_app
from app.config import *

if __name__ == "__main__":
    app = init_app()
    app.run('0.0.0.0', port="5000", debug=True)