# Writing Java in Javascript considered harmful

I made this because I am tired of seeing this:

```javascript
function NotReallyAClass() {
	this._notReallyPrivate = 'bar';
	return this
}

NotReallyAClass.prototype = new SomeGodClass();

NotReallyAClass.prototype.crash = function () {
	...
}
```

[Stop it!](http://steve-yegge.blogspot.com.au/2006/03/execution-in-kingdom-of-nouns.html)

## Dependencies
* [Sweet.js](http://sweetjs.org)
* [ADT.js](http://github.com/natefaubion/adt.js)
* [Light-Traits](http://github.com/Gozala/light-traits/)

```javascript
trait Speaks {
	log(str) {
		console.log(str)
	}
}

trait Barks {
	requires log

	bark() {
		this.log('WOOF!')
	}
}

newtype Animal {
	Dog {
		name: String
	},
	Cat {
		name: String
	}
}

impl Dog {
	mixin Speaks
	mixin Barks
}

impl Cat {
	requires log

	mixin Speaks
	
	meow() {
		this.log('MEOW!')
	}
}

var fluffy = Cat.create({name:'fluffy'});
fluffy.meow() // MEOW!

// And sparkler.js compatible
fluffy match {
	case Cat{name} => console.log(name) // fluffy
}
```
