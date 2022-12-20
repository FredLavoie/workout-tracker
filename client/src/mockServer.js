import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
    // handle missing get request
    rest.get("*", (req, res, context) => {
        return res(
            context.status(500),
            context.json({ error: "Add request handler to src/mockServer.js" })
        );
    }),
    // handle missing post request
    rest.post("*", (req, res, context) => {
        return res(
            context.status(500),
            context.json({ error: "Add request handler to src/mockServer.js" })
        );
    }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

export { server, rest };
