# Placer.js
Place Elements relative to others.

## Ussage

```js
let placer = new Placer({
  x:'center',
  y:'after',
  margin: 0,
  stayInWindow: true,
  switchSide: true,  
});

placer.toElement(element, {
  follow:true,
});
// or
placer.toClientRect(rect);

```


