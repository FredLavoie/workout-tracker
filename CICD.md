## GitHub Actions

#### CI/CD strategy
- all commits with changes on the frontend (files in `client/`) to all branches other than `main` will be linted and tested
- all commits with changes on the frontend (files in `client/`) to the `main` branch will be linted and tested, and upon successful linting and testing, will be deployed
- all commits with changes on the backend (files in `server/`) to all branches other than `main` will be linted and tested
- all commits with changes on the backend (files in `server/`) to the `main` branch will be linted and tested, and upon successful linting and testing, will be deployed