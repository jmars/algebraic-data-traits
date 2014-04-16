macro __implBody {

  rule { $Trait:ident $mixins:ident $spec:ident { } } => {}

  rule { $Trait:ident $mixins:ident $spec:ident { $($mname($args ...) { $mbody ... }) $body ... } } => {
    $spec.$mname = function($args ...) { $mbody ... };
    __implBody $Trait $mixins $spec { $body ... }
  }

  rule { $Trait:ident $mixins:ident $spec:ident { $(requires $($mixin:ident (,) ...)) $body ... } } => {
		$($spec.$mixin = $Trait.required) (;) ...
    __implBody $Trait $mixins $spec { $body ... }
  }
	
  rule { $Trait:ident $mixins:ident $spec:ident { $(mixin $($mixin:ident (,) ...)) $body ... } } => {
		$($mixins.push($mixin)) (;) ...
    __implBody $Trait $mixins $spec { $body ... }
  }
}

let impl = macro {
  rule { $name:ident { $body ... } } => {
		$name = (function(Trait, parent) {
			var spec = {};
			var mixins = [];
			__implBody Trait mixins spec { $body ... };
			var trait = Trait.compose.apply(Trait, mixins.concat([Trait(spec)]));
			parent.Trait = trait;
			var oldCreate = parent.create;
			function wrap (instance) {
				var set = instance.set.bind(instance);
				instance.set = function (val) { return wrap(set(val)) }
				return parent.Trait.create(instance);
			}
			parent.create = function (){
				var instance = oldCreate.apply(parent, arguments);
				return wrap(instance)
			}
			return parent;
		})(require('light-traits').Trait, $name);
  }
}

macro __traitBody {

  rule { $Trait:ident $mixins:ident $spec:ident { } } => {}

  rule { $Trait:ident $mixins:ident $spec:ident { $($mname($args ...) { $mbody ... }) $body ... } } => {
    $spec.$mname = function($args ...) { $mbody ... };
    __traitBody $Trait $mixins $spec { $body ... }
  }

  rule { $Trait:ident $mixins:ident $spec:ident { $(requires $($mixin:ident (,) ...)) $body ... } } => {
		$($spec.$mixin = $Trait.required) (;) ...
    __traitBody $Trait $mixins $spec { $body ... }
  }
	
  rule { $Trait:ident $mixins:ident $spec:ident { $(mixin $($mixin:ident (,) ...)) $body ... } } => {
		$($mixins.push($mixin)) (;) ...
    __traitBody $Trait $mixins $spec { $body ... }
  }
}

let trait = macro {
  rule { $name:ident { $body ... } } => {
		var $name = (function(Trait) {
			var spec = {};
			var mixins = [];
			__traitBody Trait mixins spec { $body ... };
			return Trait.compose.apply(Trait, mixins.concat([Trait(spec)]));
		})(require('light-traits').Trait);
  }
}

export trait;
export impl;
