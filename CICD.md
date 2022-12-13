## GitHub Actions - CI/CD strategy

#### eslint_jest.yml
All commits with changes on the frontend (files in `client/`) to all branches other than `main` will be linted and tested

#### python_tests_flake8.yml
All commits with changes on the backend (files in `server/`) to all branches other than `main` will be linted and tested

#### deploy-frontend.yml
All commits with changes on the frontend (files in `client/`) to the `main` branch will be linted and tested, and upon successful linting and testing, will be deployed

#### deploy-backend.yml
All commits with changes on the backend (files in `server/`) to the `main` branch will be linted and tested, and upon successful linting and testing, will be deployed