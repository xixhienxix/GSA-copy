/**
 
	Overlay widget.
	<br />
	<br />Automatically creates an overlay using the div/element's contents as the overlay contents.
	<br />This simply turns the element into an overlay. A common method is available to show the overlay by simply calling it
	 and passing it the ID of the overlay that you want to show.
	<br />Overlay HTML has been simplified for v18.
	<br />
	<br />Usage:

	<div class="ibm-common-overlay" data-widget="overlay" id="__someID__">
		<p>My overlay content here.</p>
	</div>
 
	__Event usage__: Subscribe to the IBM widget init event that fires on your DOM element to know when the widget has been initialized and you can access its APIs.
 
	<br>
	<br>__Special case:__ In scenarios where you dynamically inject HTML post page load, you can initialize the widget on your injected container like this:
	<br>- Optionally pass any settings you want (instead of using data-attributes on the HTML).

	jQuery("<your_overlay_container_selector>").overlay(optionalSettingsObject);
 
	__To destroy the widget__ and return back the original HTML that the widget initialized on:

	IBMCore.common.widget.overlay.destroy("<your_overlay_id>");
	  // or //
	myOverlayObject.destroy();
 
	@class IBMCore.common.widget.overlay
 
**/
 
 
(function ($, IBM) {
 
	/* Variables.
	***************************************************************************************/
	// Create our namespace and make a shortcut to it for ourselves,
	//  and set all glob vars for each object instance.
	var me = IBM.namespace(IBM, "common.widget.overlay"),
		$overlayBackdrop,
		overlays = [],
		currentOverlay = null,
		stack = [],
		urlOverlayToShow = IBM.common.util.url.getParam("showoverlay");

	/**
		Public jQuery plug-in definition.
		<br />Used by core v18 JS file to auto-init overlay HTML that exist on the page on DOM ready.
		<br />If you are dynamically injecting overlay HTML post-load, call this plug-in on your injected overlay container.
 
		@method $.fn.overlay
		@param [settings] {Object} Settings to override defaults and element's @data-xxxx attributes.
	**/
	$.fn.overlay = function () {
		// NOTE: "this" here is the $selector ARRAY (the jquery instance array, NOT each element!):  $(".ibm-blahblah").overlay();
		return this.each(function(){
			// NOTE: "this" here is a DOM element from the jquery "each" of this:  $(".ibm-blahblah").overlay();
			// Create the overlay widget for this $el and init it. (just does prepping).
			var widget = createOverlay({
				$overlay: $(this)
			});

			widget.init(this);
 
			// If there's a param in the URL to show an overlay onload,
			//  and that param value == this overlay's (original) id, then show this puppy automatically now.
			if (urlOverlayToShow && urlOverlayToShow === this.id) {
				widget.show();
			}
		});
	};
 
	// Helpers.
	// Since we rewrite & remove the original overlay, we need to map the original ID/el to our new overlay HTML we injected.
	// These translates the original ID from original overlay HTML to the new widget object.
	// This is how page devs use these:  onclick="IBMCore.common.widget.overlay.show("__overlayID__");

	/**
		Debugging: Loop thru each overlay in the "registered overlays" array console out all registered overlays.
 
		@method consoleAll
	**/
	me.consoleAll = function () {
		$.each(overlays, function(){
			window.console.log(this);
		});
	};
 
	/**
		Returns the overlay widget that is currently showing, else returns null.
		<br />Use this if you want to know if an overlay is already showing before you show an "automated" one.
		<br />If return is __not__ null, you can then hide the showing overlay by calling the "hide" method on the returned object.

		@method currentShowingOverlay
		@return {Object} Returns the currently showing overlay widget instance, so you can close it if you decide to.
	**/
	me.currentShowingOverlay = function () {
		return currentOverlay;
	};

	/**
		Destroys/removes an overlay by name (ID). Gets the widget for the named ID and calls object destroy method on it.
		<br />This will restore the overlay's HTML to it's original coded HTML as it was on plug-in init and
		 returns the element with the passed ID (the original coded overlay element).
		<br />If the overlay was dynamically generated via contentHtml and no HTML DOM element was injected, it simply removes the dynamic overlay element from the DOM.

		@method destroy
		@param id {String} The @id of the overlay that you want to remove/destroy.
		@return {jQuery Object} The original coded HTML overlay DOM element (via the ID you called destroy with) if exists.
	**/
	me.destroy = function (id) {
		me.getWidget(id).destroy();
 
		return $(document.getElementById(id));
	};

	/**
		Gets a particular overlay widget instance via original DOM element ID.
		Allows you to get the overlay widget object instance using your original @id since it gets wrapped and attached to
		 a special div@id. Prevents needing to know what that dynamic/auto gen'd ID is and removes dependency on it
		  in the case that we change it. Thanks to John Zimmermann for this idea.
 
		@method getWidget
		@param id {String} The @id of the overlay that you want to get the widget instance for.
		@return {Object} The widget instance for the overlay, so you can run the methods on it.
	**/
	me.getWidget = function (id) {
		return $(document.getElementById(id)).closest("[data-widget='overlay container']").data("widget");
	};

	/**
		Hides an overlay (via @id value).
 
		@method hide
		@param id {String} The @id of the overlay to hide.
		@param [closeAlert] {Boolean} Pass this as true to force hiding of an alert type overlay.
	**/
	me.hide = function (id, closeAlert) {
		$(document.getElementById(id)).closest("[data-widget='overlay container']").data("widget").hide(closeAlert);
	};

	/**
		Loops thru each overlay in the "registered overlays" array and hide it.
 
		@method hideAllOverlays
	**/
	me.hideAllOverlays = function () {
		$.each(overlays, function () {
			this.hide();
		});
	};

	/**
		Shows an overlay (via @id value).
 
		@method show
		@param id {String} The @id of the overlay to show.
	**/
	me.show = function (id) {
		$(document.getElementById(id)).closest("[data-widget='overlay container']").data("widget").show();
	};

	/**
		Called by our jQuery plug-in.
		<br />Alternate way to create an overlay - Dynamically create one".
		<br />This creates a new overlay widget and registers the instance into array of all this widget instances.
		<br />The jQuery plugin abstracts this and makes behind-the-scenes changes easy.

		@method createOverlay
		@param [settings] {Object} Settings to override defaults and element's @data-xxxx attributes.
		@return {Object} The widget object instance created.
		@example
			myOverlay = IBMCore.common.widget.overlay.createOverlay({settings here});
	**/
	me.createOverlay = createOverlay;
	function createOverlay (settings) {
		var ov = new Overlay(settings);
		overlays.push(ov);
		return ov;
	}
 
	/**
		Fires a stats event for this widget.

		@method fireStatsEvent
		@private
		@param eventType {String} Type of event that happened.
		@param id {String} The @id of the widget it happened on.
	**/
	function fireStatsEvent (eventType, id) {
		IBM.common.util.statshelper.fireEvent({
			"ibmEV" : "widget",
			"ibmEvGroup" : "Overlay",
			"ibmEvName" : eventType,
			"ibmEvAction" : id
		});
	}
 
	/**
		Shows/hides the "screen" and sets it's opacity.
 
		@method updateBackdrop
		@private
	**/
	function updateBackdrop () {
		if (stack.length === 0) {
			$overlayBackdrop.hide();
			IBM.common.util.freezeScrollbars(false);
		}
		else {
			var max = 0,
				i,
				dd,
				len = stack.length;

			for (i = 0; i < len; i++) {
				dd = stack[i];
				max = Math.max(max, dd.backdrop_opacity);
			}

			$overlayBackdrop.css("opacity", max);

			$overlayBackdrop.show();
			IBM.common.util.freezeScrollbars(true);
		}
	}

	/**
		Published on widget's DOM element (overlay) after overlay has been initialized.
		<br><strong>Example usage</strong>:
		<pre>
			jQuery("&lt;your_overlay_container_selector>")[0].addEventListener("ibm-init", function (evt) {
			    // overlay widget is available.
			});
		</pre>

		@event ibm-init
	**/
	/**
		Publishes this event after the overlay is hidden.
		@event hide
	**/
	/**
		Publishes this event after the trigger is clicked, but before the actual "showing" of the overlay.
		@event pre-show
	**/
	/**
		Publishes this event after the overlay is shown.
		@event show
	**/
	/**
		Overlay object/constructor for our public jQuery plugin.
		<br />Called by "createOverlay".
		<br />You can't use this directly. Use the standard jQuery(xxxx).overlay() plug-in method to turn your overlay HTML into an overlay widget.
 
		@method Overlay
		@constructor
		@param [settings] {Object} Settings to override defaults and element's @data-xxxx attributes.
		@example
			// You can access your widget object that was created (this) using the standard convention:
			IBMCore.common.widget.overlay.getWidget("<your_overlay_id>")
	**/
	function Overlay (settings) {
		// Merge the settings in the appropriate hierarchy per documentation:
		//   Defaults get overidden by html @data-attrs (.data()) which get overridden by explicit params in the JS call.
		var defaults =  {
				$overlay: null,
				allowResize: true,
				arialabel: "Overlay content",
				ariadescribedby: true,
				backdropopacity: 0.5,
				backgroundcolor: null,
				classes: "",
				contentHtml: null,
				fullwidth: false,
				hidexscroll: false,
				id: "ibm-overlaywidget-" + ($("[data-widget='overlay container']").length + 1),
				name: "",
				type: "modal"
			},
			$overlayDataAttrs = settings.$overlay ? settings.$overlay.data() : {},

			// Merge the settings in the proper hierarchy order.
			appliedSettings = $.extend(true, defaults, $overlayDataAttrs, settings),

			// Start our common vars.
			me = this,
			myEvents = IBM.common.util.eventCoordinator(me, "Overlay", [
				"show",
				"hide",
				"pre-show",
				"background-change",
				"direction-change",
				"positioner-change",
				"resize"
			]),
			$closer,
			$content,
			$overlay = appliedSettings.$overlay,
			$origEl,
			active_class = "active",
			custom_color = appliedSettings.backgroundcolor,
			is_first_hide = true,
			is_first_show = true,
			is_showing = false,
			last_dim = {
				x : 0,
				y : 0,
				w : 0,
				h : 0
			},
			on_hide_fns = [],
			on_show_fns = [],
			overlayClasses = "ibm-common-overlay " + appliedSettings.classes,
			prepped_class = "prepped",
			returnFocusEl,
			z_index = 0;
 
		// If the overlay exist, use the ID and classes from it.
		if ($overlay) {
			if ($overlay[0].id !== "") {
				appliedSettings.id = "ibm-overlaywidget-" + $overlay[0].id;
			}
 
			overlayClasses = $overlay[0].getAttribute("class");
		}
 
		// Set public stuff.
		me.backdrop_opacity = appliedSettings.backdropopacity;
		me.id = appliedSettings.id;

		/**
			This is a method of the "Overlay" constructor.
			<br />Destroys the overlay and puts back the original HTML element that existed before the widget initialized.

			@method Overlay.destroy
			@return {jQuery/DOM element} The original element that was put back (that you called widget destroy on).
		**/
		me.destroy = function () {
			hide();

			$overlay.replaceWith($origEl);
 
			$.each(overlays, function(i){
				if (this.id === me.id) {
					overlays.splice(i, 1);
				}
			});
 
			return $origEl;
		};
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Called by our public jQuery plug-in after a new overlay object has been created and returned by "createOverlay".
			<br />Automatically inits the overlay plug-in merging in any manually passed settings,
			 @data-xxxxx settings, and our default settings.

			@method Overlay.init
		**/
		me.init = function () {
			// Currently wrapping contentHtml, or an existing v17 coded overlay in the new wrapper.
			// Should we require new HTML for overlay and ditch old stuff?
			var $overlayShell = $('<div class="" id="' + me.id + '" role="dialog" aria-describedby="' + me.id + '-content" aria-label="' + appliedSettings.arialabel + '" data-widget="overlay container" data-name="' + appliedSettings.name + '"><div class="ibm-overlay-heading-con"><p class="ibm-icononly"><a href="javascript:void(0);" class="ibm-close-link" role="button">Close</a></p></div><div id="' + me.id + '-content" class="content"></div></div>'),
				$overlayContent;

			// Add a restore point to return the HTML back to it's originally coded element.
			// Uses passed HTML, or clones the original element.
			$origEl = appliedSettings.contentHtml || $overlay.clone(true);
 
			// If they passed in HTML content to use, convert that to overlay content element,
			// else use the element they init'd the widget on but clean it up.
			$overlayContent = appliedSettings.contentHtml ? $(appliedSettings.contentHtml) : $overlay.attr("class", "");
 
			// Move the overlay content (orig el) into the overlay shell.
			$overlayShell.find(".content").append($overlayContent);

			// Append new wrapped overlay HTML into #ibm-top,
			//  set the data-widget to this object instance,
			//  resets the $overlay pointer to injected overlay.
			$overlay = $overlayShell.addClass(overlayClasses).appendTo(document.body).data("widget", me);
 
			// Setup shortcuts.
			$closer = $overlay.find(".ibm-overlay-heading-con .ibm-close-link");
			$content = $overlay.find(".content [data-widget='overlay']");

			// If they generated the overlay programatically and didn't use data-widget attribute,
			// Set the content to be the .content div directly instead of their DIV they init'd the plugin on.
			if (!$content[0]) {
				$content = $overlay.find(".content");
			}
 
			// If they don't want the aria-described by, remove the attribute. The only time you don't need is is if there's no content before the focusable element.
			if (appliedSettings.ariadescribedby === false) {
				$overlay.removeAttr("aria-describedby");
			}
 
			if (appliedSettings.fullwidth) {
				$overlay.addClass("full-width");
			}
 
			// If it's alert type, this means there's no close button and they can't close the overlay with
			//  keyboard or clicking outside content box. Overlay is "locked" and requres an explicit action in the overlay
			//  content to happen and to close the overlay.
			if (appliedSettings.type === "alert") {
				$closer.remove();
			}
 
			// Get and set translated text for "close".
			if ($content.find(".ibm-common-overlay-close")[0]) {
				$closer.html($content.find(".ibm-common-overlay-close")[0].innerHTML);
			}
			else {
				IBM.common.translations.subscribe("dataReady", "Overlay", function(){
					$closer.html(IBM.common.translations.data.v18main.misc.close);
				}).runAsap(function(){
					$closer.html(IBM.common.translations.data.v18main.misc.close);
				});
			}

			if (appliedSettings.seamless) {
				seamless(true);
			}
 
			if (typeof appliedSettings.width !== "undefined") {
				setWidth(appliedSettings.width);
			}
 
			if (typeof appliedSettings.height !== "undefined") {
				setHeight(appliedSettings.height);
			}

			if (custom_color) {
				setBackground(custom_color);
			}
 
			if (appliedSettings.hidexscroll) {
				$content.addClass("hidexscroll");
			}
 
			// Do bindings.
			$closer.click(function (evt) {
				evt.preventDefault();
				hide();
			});

			// For proper a11y, set the tabindex on the content div so it's focused and
			// screen readers start reading content from the top.
			// Then on close/hide, remove it from tab ring.
			myEvents.subscribe("show", "Overlay init", function(){
				$overlay.find(".content").attr("tabindex",0).focus();
			});
 
			// On overlay hide, change tab index and pause any videos.
			myEvents.subscribe("hide", "Overlay init", function(){
				$overlay.find(".content").attr("tabindex", -1);
 
				if ($overlay.find("[data-widget=videoplayer]").data("widget") && $overlay.find("[data-widget=videoplayer]").data("widget").pauseVideo) {
					$overlay.find("[data-widget=videoplayer]").data("widget").pauseVideo();
				}
			});
 
			// Setup tab ring for accessibility.
			// If they tab forward on the last content link, focus on the closer.
			// If they tab backward from the closer focus on the last content link
			$overlay.on("keydown", function (evt) {
				var $lastLink = $overlay.find(":focusable:last"),
					$firstLink = $overlay.find(":focusable:first"); // Close link.

				if (evt.keyCode === 9 && !evt.shiftKey && $(evt.target).is($lastLink)) {
					evt.preventDefault();
					$firstLink.focus();
				}
				else if (evt.keyCode === 9 && evt.shiftKey && $(evt.target).is($firstLink)) {
					evt.preventDefault();
					$lastLink.focus();
				}
			});
 
			if ($overlay.find("[data-widget='overlay']")[0]) {
				IBM.common.widget.manager.dispatchInitEvent($overlay.find("[data-widget='overlay']")[0]);
			}
		};
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Returns the @id of this overlay widget instance.
 
			@method Overlay.getId
			@return {String} The @id of the overlay widget.
		**/
		me.getId = function () {
			return me.id;
		};
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Inserts the provided content HTML into the overlay in the proper place.
			<br />If passed an empty string (literally), it will hide the overlay.
 
			@method Overlay.setHtml
			@param html {String} HTML (content) to put in the overlay.
			@return {Object} The overlay widget object you called it on.
		**/
		me.setHtml = setHtml;
		function setHtml (html) {
			$content.html(html);
 
			if (html === "") {
				hide();
			}
			return me;
		}
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Manually sets the width of the overlay using the given # (in px).
			<br />You probably never want to use this. This was legacy support for IE8/9.
 
			@method Overlay.setWidth
			@deprecated
			@param [px] {Integer} The width in px to set overlay to. If none given (null), it sets it to "auto".
			@return {Object} The overlay widget object you called it on.
		**/
		me.setWidth = setWidth;
		function setWidth (px) {
			px = typeof px !== "undefined" ? px + "px" : "auto" ;
 
			$content.css("width", px);
 
			return me;
		}
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Manually sets the height of the overlay using the given # (in px).
			<br />You probably never want to use this. This was legacy support for IE8/9.
 
			@method Overlay.setHeight
			@deprecated
			@param [px] {Integer} The height in px to set overlay to. If none given (null), it sets it to "auto".
			@return {Object} The overlay widget object you called it on.
		**/
		// me.setHeight = setHeight;
		function setHeight (px) {
			px = typeof px !== "undefined" ? px + "px" : "auto" ;

			$content.css("height", px);
 
			return me;
		}
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Sets the background color of the overlay using the given RGB string.
 
			@method Overlay.setBackground
			@param rgb {String} The RGB string for the color to set the background to.
			@return {Object} The overlay widget object you called it on.
		**/
		me.setBackground = setBackground;
		function setBackground (rgb) {
			var newColorSet = IBM.common.util.color.createColor(rgb),
				newBackground = newColorSet.rgba();

			$overlay.css({
				//"color": newColorSet.accessibleTextColor,
				"backgroundColor": newBackground
			});
 
			// Add class to overlay to denote what color the text should be and control it in the CSS.
			// This function ^ is only called if a custom color is used. Otherwise we know it's black text.
			$overlay.addClass("ibm-overlay-text-" + newColorSet.accessibleTextColor);

			custom_color = newBackground;
 
			return me;
		}

		/**
			DOES NOTHING. Will be removed soon.
 
			@method Ovelay.setPosition
			@deprecated
			@return {Object} The overlay widget object you called it on.
		**/
		me.setPosition = setPosition;
		function setPosition () {
			return me;
		}
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Gets and returns the index of the overlay in the stack of overlays that are showing.
 
			@method Ovelay.getStackIndex
			@deprecated
			@return {Integer} The index # of the overlay in the stack that's showing.
		**/
		me.getStackIndex = getStackIndex;
		function getStackIndex () {
			var i = -1,
				stackLen = stack.length;

			while (++i < stackLen) {
				if (me.id === stack[i].getId()) {
					break;
				}
			}

			return i < stackLen ? i : -1;
		}
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Actually shows the overlay.
 
			@method Ovelay.show
			@return {Object} The overlay widget object you called it on.
		**/
		me.show = show;
		function show () {
			returnFocusEl = document.activeElement;

			if ($content.innerHTML === "") {
				window.console.warn("v18: Will not show an empty overlay");
				return false;
			}
 
			if (isShowing()) {
				window.console.warn("v18: This overlay is already showing");
				return false;
			}
 
			currentOverlay = me;
			stack.push(me);
			setStackZIndex();
			updateBackdrop();
 
			$.each(on_show_fns, function(){
				var ret = this.call(me, is_first_show);
			});
 
			myEvents.publish("pre-show", is_first_show);
 
			$overlay.addClass(prepped_class + " " + active_class);

			myEvents.publish("show", is_first_show);

			fireStatsEvent("show", me.id);
 
			is_showing = true;
 
			return me;
		}
 
		/**
			__Deprecated__. Don't use.
 
			@method setStackZIndex
			@deprecated
			@private
		**/
		function setStackZIndex () {
			z_index = (920) + getStackIndex();
			$overlay.css("zIndex", z_index);
		}
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Gets and returns the z-index property of this overlay instance.
 
			@method Ovelay.getZindex
			@deprecated
			@return {Integer} The z-index of this overlay instance.
		**/
		me.getZindex = function () {
			return z_index;
		};
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Hides the overlay.
 
			@method Ovelay.hide
			@param [closeAlert] {Boolean} Must pass this as true to hide an 'alert' type overlay.
			@return {Object} The overlay widget object you called it on.
		**/
		me.hide = hide;
		function hide (closeAlert) {
			if (!isShowing()) {
				return me;
			}
 
			// An alert type overlay cannot be closed with normal close, click, esc key. User must take action in the overlay.
			// The overlay content/action must call .hide(true) to force the closing of the alert type overlay.
			if (appliedSettings.type === "alert" && !closeAlert) {
				return me;
			}
 
			$.each(on_hide_fns, function(){
				var ret = this.call(me, is_first_hide);
			});
 
			currentOverlay = null;
 
			stack.splice(getStackIndex(), 1);
 
			updateBackdrop();
 
			$overlay.removeClass(active_class);

			setTimeout(function(){
				$overlay.removeClass(prepped_class);
			}, 100);
 
			myEvents.publish("hide", is_first_hide);
 
			fireStatsEvent("hide", me.id);
 
			is_first_hide = false;
 
			is_showing = false;
 
			$(returnFocusEl).focus();
 
			return me;
		}
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Toggles the overlay: Shows if currently hidden, hides if currently showing (DUH).
 
			@method Ovelay.toggle
			@return {Object} The overlay widget object you called it on.
		**/
		me.toggle = toggle;
		function toggle () {
			if (isShowing()) {
				hide();
			}
			else {
				show();
			}
 
			return me;
		}
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Tells you if the overlay is currently showing or not.
 
			@method Ovelay.isShowing
			@return {Boolean} True or False.
		**/
		me.isShowing = isShowing;
		me.isOpen = isShowing; // "isOpen" is deprecated function name. We use show/hide.
		function isShowing () {
			return is_showing;
		}
 
		/**
			This is a method of the "Overlay" constructor.
			<br />Getter or setter; based on if you pass a param or not:
			<br />If no param passed, it will tell you if the overlay is seamless or not.
			<br />If you pass a boolean (true | false), it will set the overlay to be seamless or not (add/remove class).
 
			@method Ovelay.seamless
			@param bool {Boolean} Set or remove the seamless style on the overlay object.
			@return {Object} The overlay widget object you called it on.
		**/
		me.seamless = seamless;
		function seamless (bool) {
			var classname = "seamless";

			if (typeof bool === "undefined") {
				return $overlay[0].className.indexOf(classname) > -1;
			}
 
			$overlay[bool === false ? "removeClass" : "addClass"](classname);
 
			return me;
		}
	}

	/* Run now.
	***************************************************************************************/

	// Bind esc key to close the topmost overlay in the stack.
	$(document).keydown(function (evt) {
		var kc = evt.keyCode || evt.which;

		switch (kc) {
			case 27:
				if (stack.length > 0) {
					stack[stack.length - 1].hide();
				}
				break;
		}
	});
 
	// On DOM load, inject the backdrop/screen then bind it to show/hide/etc.
	$(function () {
		$overlayBackdrop = $('<div id="ibm-overlay-backdrop"></div>').appendTo(document.body);
 
		$overlayBackdrop.show = function(){
			$(document.body).addClass("ibm-overlay-backdrop-visible");
		};

		$overlayBackdrop.hide = function(){
			$(document.body).removeClass("ibm-overlay-backdrop-visible");
		};

		$overlayBackdrop.click(me.hideAllOverlays);
	});

})(jQuery, IBMCore);
 