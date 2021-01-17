




export function wrapper(fn: Function, context: any, req: any, res: any, next: any) {
    fn.bind(context)(req, res, next).then((data: any) => {
        try {
            const headers = data?.response?.headers || false;
            const redirect = data?.response?.redirect || false;
            const redirectStatus = data?.response?.redirectStatus || 301;
            const ssr = data?.ssr || {};
            const body = data?.response?.body;

            if (redirect && redirectStatus) {
                return res.redirect(redirectStatus, redirect);
            }

            if (body) {
                if (headers) {
                    res.set(headers);
                }
                return res.json(body);
            }

            return res.render('index', { req, res, ssr, headers });
        } catch (err) {
            return next(err);
        }
    });
}