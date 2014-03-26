# Multiplicity
`Multiplicity` is a very simple yet powerful text-based calculator built in Javascript.

## Sales Pitch

From the developer of Periodic comes another tool built for students. Multiplicity mirrors the core functionality and usability of calculators like the TI84 or TINspire to which high-school students and teachers have become so accustomed. Being run from a browser has many benefits for doing online work like [WebAssign](http://webassign.net/), including the ability to copy and paste long decimals rather than typing them manually. The only real interface of this calculator is your keyboard, which allows long expressions to be input much more quickly and easily than with a calculator keypad. Perhaps the largest benefit of all, however, is that this calculator is absolutely free.

### [Repo hosted here](http://jmkl.co/multiplicity/)


## Development

This project began in February 2014 when I once tried to do a math assignment entirely through Apple's Spotlight calculator. Sure, I could enter simple enough expressions and could copy down the answer it spit back, but the whole proccess was abysmally slow. I drew some sketches for a hyper-minimalist calculator that would be like Apple's Calculator functionality but a lot more powerful and effective.

The basis of the calculator is [Matthew Crumley's Javascript Expression Evaluator](http://silentmatt.com/javascript-expression-evaluator/), though I had to modify and work around several problems to better mirror the calculators students would be using; where Matt's calculator interpreted strings into something Javascript functions could handle, I tried to turn it into something students would be more comfortable with. To achieve this, many features needed to be added, like scientific notation, "ans" functionality, history reloading and insertion, or variable functionality.
