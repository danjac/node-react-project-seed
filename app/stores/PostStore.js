import Reflux from 'reflux';
import request from 'superagent';
import Immutable from 'immutable';
import _ from 'lodash';
import actions from '../actions';

export default Reflux.createStore({

    listenables: actions,

    init() {
        this.posts = new Immutable.List();
        this.page = 1;
        this.total = 0;
        this.isFirst = true;
        this.isLast = true;
    },

    _trigger() {
        this.trigger({
            posts: this.posts,
            page: this.page,
            total: this.total,
            isFirst: this.isFirst,
            isLast: this.isLast
        });
    },

    indexOf(post) {
        return this.posts.findIndex((p) => p._id === post._id);
    },

    deletePost(post) {
        this.posts = this.posts.delete(this.indexOf(post));
        this.total -= 1;
        this._trigger();
    },

    adjustScore(post, amount) {
        this.posts = this.posts.update(this.indexOf(post), (p) => {
            p.score += amount;
            return p;
        });
        this._trigger();
    },

    voteUp(post) {
        this.adjustScore(post, 1);
    },

    voteDown(post) {
        this.adjustScore(post, -1);
    },


    fetchPostsCompleted(page, result) {
        this.page = page;
        this.posts = new Immutable.List(result.posts);
        this.isFirst = result.isFirst;
        this.isLast = result.isLast;
        this.total = result.total;
        this._trigger();
    },

    getDefaultData() {
        return {
            posts: this.posts,
            page: this.page,
            total: this.total,
            isFirst: this.isFirst,
            isLast: this.isLast
        };
    }
});
