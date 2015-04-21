import send from 'koa-send';
import bootstrap from '../,./app/bootstrap';


export function* logout() {
    this.logout();
    this.session = null;
    this.redirect("/");
}

export function* index () {

    const appjs = this.app.env === 'development'? 'http://localhost:8080/js/app.js' : '/js/app.js';
    const user = this.passport.user || null;

    bootstrap({
        user: user
    });

    const component = yield this.reactify();

    yield this.render('index', {
        component: component,
        csrfToken: this.csrf,
        appjs: appjs,
        user: JSON.stringify(user)
    });
}
