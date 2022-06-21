/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */

export class Placer {
    constructor(el, options={}){
        this.el = el;
        this.followingAdjust = this.followingAdjust.bind(this);

        this.options = { // default
            y: 'after',
            x: 'prepend',
            stayInWindow: true,
            switchSide: true,
        };
        this.setOptions(options);
    }
    setOptions(options){
        Object.assign(this.options, options);
        this.followingAdjust();
    }
    toElement(el) {
        this.unfollow();
        this._toElement(el);
    }

    /**
     * @private
     */
    _toElement(el) {
        let rect = el.getBoundingClientRect();
        this.toClientRect(rect);
    }

    /**
     * @private
     * @param {ClientRect} rect
     */
    toClientRect(rect){
        /* margin can be done with css? would be better so we can use differen units */
        if (this.options.margin) {
            let margin = this.options.margin
            rect = {
                top:    rect.top    - margin,
                bottom: rect.bottom + margin,
                left:   rect.left   - margin,
                right:  rect.right  + margin,
                height: rect.height + margin*2,
                width:  rect.width  + margin*2,
            };
        }
        let viewport = { // viewport relative to the layer
            top: 0,
            left: 0,
        };

        let position = getComputedStyle(this.el).getPropertyValue('position');
        if (position !== 'fixed') {
            let root = offsetParent(this.el);
            if (root) {
                // if (!root) root = doc.documentElement; // make no sense
                viewport = root.getBoundingClientRect();
                rect = {
                    top:    rect.top    - viewport.top,
                    bottom: rect.bottom - viewport.top,
                    left:   rect.left   - viewport.left,
                    right:  rect.right  - viewport.left,
                    width:  rect.width,
                    height: rect.height,
                };
            }
        }
        // start
        let placeY = this.options.y;
        let placeX = this.options.x;

        var innerWidth  = doc.documentElement.clientWidth;
        var innerHeight = doc.documentElement.clientHeight;

        var layerWidth  = this.el.offsetWidth; // scrollWidth?
        var layerHeight = this.el.offsetHeight;

        let x = 0;
        if (placeX==='prepend') x = rect.left;
        if (placeX==='after')   x = rect.right;
        if (this.options.switchSide && x + layerWidth + viewport.left > innerWidth) placeX = placeX === 'prepend' ? 'append' : 'before';
        if (placeX==='before')  x = rect.left  - layerWidth;
        if (placeX==='append')  x = rect.right - layerWidth;
        if (x < -viewport.left) x = placeX === 'before' ? rect.right : rect.left;
        if (placeX==='center')  x = rect.right - rect.width/2 - layerWidth/2;

        let y = 0;
        if (placeY==='prepend') y = rect.top;
        if (placeY==='after')   y = rect.bottom;
        if (this.options.switchSide && y + layerHeight + viewport.top > innerHeight) placeY = placeY === 'prepend' ? 'append' : 'before';
        if (placeY==='before')  y = rect.top    - layerHeight;
        if (placeY==='append')  y = rect.bottom - layerHeight;
        if (y < -viewport.top)  y = placeY === 'before' ? rect.bottom : rect.top;
        if (placeY==='center')  y = rect.top + rect.height/2 - layerHeight/2;

        if (this.options.stayInWindow) {
            x = clamp(x, -viewport.left, innerWidth  - viewport.left - layerWidth);
            y = clamp(y, -viewport.top,  innerHeight - viewport.top  - layerHeight);
        }

        if (position === 'absolute') {
            x += scrollX;
            y += scrollY;
        }

        requestAnimationFrame(()=>{
            this.el.style.top  = y + 'px';
            this.el.style.left = x + 'px';
        });

        this.positionX = placeX;
        this.positionY = placeY;
    }

    // follow:
    followElement(el){
        if (this.following === el) return;
        this.following = el;
        if (!el) return;
        clearInterval(this.followInterval);
        this.followInterval = setInterval(this.followingAdjust,200);
        addEventListener('resize',this.followingAdjust,{passive:true});
        doc.addEventListener('mousemove',this.followingAdjust,{passive:true});
        doc.addEventListener('mouseup',this.followingAdjust,{passive:true});
        doc.addEventListener('input',this.followingAdjust,{passive:true, capture:true});
        doc.addEventListener('scroll',this.followingAdjust,{passive:true, capture:true});
        this.followingAdjust();
    }
    unfollow(){
        this.following = null;
        clearInterval(this.followInterval);
        removeEventListener('resize',this.followingAdjust,{passive:true});
        doc.removeEventListener('mousemove',this.followingAdjust,{passive:true});
        doc.removeEventListener('mouseup',this.followingAdjust,{passive:true});
        doc.removeEventListener('input',this.followingAdjust,{passive:true, capture:true});
        doc.removeEventListener('scroll',this.followingAdjust,{passive:true, capture:true});
    }

    /**
     * @private
     */
    followingAdjust(){
        const run = this.following && this.el.parentNode && this.following.parentNode && this.el.offsetWidth && this.following.offsetWidth;
        run ? this._toElement(this.following) : this.unfollow();
    }
};


const offsetParent = (el) => {
    var parent = el.offsetParent;
    if (parent === doc.body) {
        let position = getComputedStyle(parent).getPropertyValue('position');
        if (position === 'static') parent = null;
    }
    return parent;
}

const clamp=(value, min, max) => value < min ? min : value > max ? max : value;

const doc = document;
