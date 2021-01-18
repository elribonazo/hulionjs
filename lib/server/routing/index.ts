




export function wrapper(fn: Function, context: any, req: any, res: any, next: any) {
    fn.bind(context)(req, res, next).then((data: any) => {
        try {
            if (!res.finished) {

                const headers = data?.response?.headers || false;
                const redirect = data?.response?.redirect || false;
                const redirectStatus = data?.response?.redirectStatus || 301;
                const ssr = data?.ssr || {};
                const body = data?.response?.body;

                if (redirect && redirectStatus) {
                    res.redirect(redirectStatus, redirect);
                } else {
                    if (body) {
                        if (headers) {
                            res.set(headers);
                        }
                        res.json(body);
                    } else {
                        res.render('index', { req, res, ssr, headers });
                    }
                }

            }

            return Promise.resolve();

        } catch (err) {
            return next(err);
        }
    });
}