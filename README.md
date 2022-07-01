# Placer.js
Absolute place elements relative to others

## Ussage

```js
let placer = new Placer(moverEl, {
  x:'after',
  y:'after',
  margin: 0,
  stayInWindow: true,
  switchSide: true,
});

placer.toElement(target);
```

```html
<div id=moverEl style="position:absolute">move to</div>
<button id=target>
    move to me
</button>
```

[doc](https://doc.deno.land/https://cdn.jsdelivr.net/gh/u1ui/Placer.js@1.0.0/Placer.js)

## Install

```js
import {Placer} from "https://cdn.jsdelivr.net/gh/u1ui/Placer.js@1.0.0/Placer.min.js"
```

## Demos

[minimal.html](http://gcdn.li/u1ui/Placer.js@main/tests/minimal.html)  
[test.html](http://gcdn.li/u1ui/Placer.js@main/tests/test.html)  

## About

- MIT License, Copyright (c) 2022 <u1> (like all repositories in this organization) <br>
- Suggestions, ideas, finding bugs and making pull requests make us very happy. ♥

