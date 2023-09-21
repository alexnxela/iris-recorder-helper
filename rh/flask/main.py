from app import init_app
from app.config import *

if __name__ == "__main__":
    print('test')
    print(os.environ.get('TEST_SECRET'))
    print('test 123')

    for key, value in os.environ.items():
        print(f'os:{key}: {value}')


    app = init_app()
    app.run('0.0.0.0', port="5000", debug=True)