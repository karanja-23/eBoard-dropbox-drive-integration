import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  BaseComponent
} from "./chunk-AT3LYM63.js";
import {
  BaseStyle
} from "./chunk-YSGUEI2A.js";
import {
  SharedModule,
  addClass,
  getHeight,
  getOffset,
  getOuterHeight,
  getOuterWidth,
  getWidth,
  hasClass,
  isEmpty,
  isNotEmpty,
  remove,
  removeClass,
  uuid
} from "./chunk-KNPMRTZL.js";
import {
  CommonModule
} from "./chunk-MAOPXJYG.js";
import {
  isPlatformBrowser
} from "./chunk-AZBSIVAO.js";
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Injectable,
  Input,
  NgModule,
  NgZone,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵgetInheritedFactory,
  ɵɵstyleMap,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-2VCDYKZS.js";

// node_modules/primeng/fesm2022/primeng-badge.mjs
var theme = ({
  dt
}) => `
.p-badge {
    display: inline-flex;
    border-radius: ${dt("badge.border.radius")};
    justify-content: center;
    padding: ${dt("badge.padding")};
    background: ${dt("badge.primary.background")};
    color: ${dt("badge.primary.color")};
    font-size: ${dt("badge.font.size")};
    font-weight: ${dt("badge.font.weight")};
    min-width: ${dt("badge.min.width")};
    height: ${dt("badge.height")};
    line-height: ${dt("badge.height")};
}

.p-badge-dot {
    width: ${dt("badge.dot.size")};
    min-width: ${dt("badge.dot.size")};
    height: ${dt("badge.dot.size")};
    border-radius: 50%;
    padding: 0;
}

.p-badge-circle {
    padding: 0;
    border-radius: 50%;
}

.p-badge-secondary {
    background: ${dt("badge.secondary.background")};
    color: ${dt("badge.secondary.color")};
}

.p-badge-success {
    background: ${dt("badge.success.background")};
    color: ${dt("badge.success.color")};
}

.p-badge-info {
    background: ${dt("badge.info.background")};
    color: ${dt("badge.info.color")};
}

.p-badge-warn {
    background: ${dt("badge.warn.background")};
    color: ${dt("badge.warn.color")};
}

.p-badge-danger {
    background: ${dt("badge.danger.background")};
    color: ${dt("badge.danger.color")};
}

.p-badge-contrast {
    background: ${dt("badge.contrast.background")};
    color: ${dt("badge.contrast.color")};
}

.p-badge-sm {
    font-size: ${dt("badge.sm.font.size")};
    min-width: ${dt("badge.sm.min.width")};
    height: ${dt("badge.sm.height")};
    line-height: ${dt("badge.sm.height")};
}

.p-badge-lg {
    font-size: ${dt("badge.lg.font.size")};
    min-width: ${dt("badge.lg.min.width")};
    height: ${dt("badge.lg.height")};
    line-height: ${dt("badge.lg.height")};
}

.p-badge-xl {
    font-size: ${dt("badge.xl.font.size")};
    min-width: ${dt("badge.xl.min.width")};
    height: ${dt("badge.xl.height")};
    line-height: ${dt("badge.xl.height")};
}

/* For PrimeNG (directive)*/

.p-overlay-badge {
    position: relative;
}

.p-overlay-badge > .p-badge {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
    margin: 0;
}
`;
var classes = {
  root: ({
    props,
    instance
  }) => ["p-badge p-component", {
    "p-badge-circle": isNotEmpty(props.value) && String(props.value).length === 1,
    "p-badge-dot": isEmpty(props.value) && !instance.$slots.default,
    "p-badge-sm": props.size === "small",
    "p-badge-lg": props.size === "large",
    "p-badge-xl": props.size === "xlarge",
    "p-badge-info": props.severity === "info",
    "p-badge-success": props.severity === "success",
    "p-badge-warn": props.severity === "warn",
    "p-badge-danger": props.severity === "danger",
    "p-badge-secondary": props.severity === "secondary",
    "p-badge-contrast": props.severity === "contrast"
  }]
};
var BadgeStyle = class _BadgeStyle extends BaseStyle {
  name = "badge";
  theme = theme;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵBadgeStyle_BaseFactory;
    return function BadgeStyle_Factory(__ngFactoryType__) {
      return (ɵBadgeStyle_BaseFactory || (ɵBadgeStyle_BaseFactory = ɵɵgetInheritedFactory(_BadgeStyle)))(__ngFactoryType__ || _BadgeStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _BadgeStyle,
    factory: _BadgeStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeStyle, [{
    type: Injectable
  }], null, null);
})();
var BadgeClasses;
(function(BadgeClasses2) {
  BadgeClasses2["root"] = "p-badge";
})(BadgeClasses || (BadgeClasses = {}));
var BadgeDirective = class _BadgeDirective extends BaseComponent {
  /**
   * When specified, disables the component.
   * @group Props
   */
  disabled;
  /**
   * Size of the badge, valid options are "large" and "xlarge".
   * @group Props
   */
  badgeSize;
  /**
   * Size of the badge, valid options are "large" and "xlarge".
   * @group Props
   * @deprecated use badgeSize instead.
   */
  set size(value) {
    this._size = value;
    console.log("size property is deprecated and will removed in v18, use badgeSize instead.");
  }
  get size() {
    return this._size;
  }
  _size;
  /**
   * Severity type of the badge.
   * @group Props
   */
  severity;
  /**
   * Value to display inside the badge.
   * @group Props
   */
  value;
  /**
   * Inline style of the element.
   * @group Props
   */
  badgeStyle;
  /**
   * Class of the element.
   * @group Props
   */
  badgeStyleClass;
  id;
  badgeEl;
  _componentStyle = inject(BadgeStyle);
  get activeElement() {
    return this.el.nativeElement.nodeName.indexOf("-") != -1 ? this.el.nativeElement.firstChild : this.el.nativeElement;
  }
  get canUpdateBadge() {
    return this.id && !this.disabled;
  }
  constructor() {
    super();
  }
  ngOnChanges({
    value,
    size,
    severity,
    disabled,
    badgeStyle,
    badgeStyleClass
  }) {
    super.ngOnChanges({
      value,
      size,
      severity,
      disabled
    });
    if (disabled) {
      this.toggleDisableState();
    }
    if (!this.canUpdateBadge) {
      return;
    }
    if (severity) {
      this.setSeverity(severity.previousValue);
    }
    if (size) {
      this.setSizeClasses();
    }
    if (value) {
      this.setValue();
    }
    if (badgeStyle || badgeStyleClass) {
      this.applyStyles();
    }
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.id = uuid("pn_id_") + "_badge";
    this.renderBadgeContent();
  }
  setValue(element) {
    const badge = element ?? this.document.getElementById(this.id);
    if (!badge) {
      return;
    }
    if (this.value != null) {
      if (hasClass(badge, "p-badge-dot")) {
        removeClass(badge, "p-badge-dot");
      }
      if (this.value && String(this.value).length === 1) {
        addClass(badge, "p-badge-circle");
      } else {
        removeClass(badge, "p-badge-circle");
      }
    } else {
      if (!hasClass(badge, "p-badge-dot")) {
        addClass(badge, "p-badge-dot");
      }
      removeClass(badge, "p-badge-circle");
    }
    badge.innerHTML = "";
    const badgeValue = this.value != null ? String(this.value) : "";
    this.renderer.appendChild(badge, this.document.createTextNode(badgeValue));
  }
  setSizeClasses(element) {
    const badge = element ?? this.document.getElementById(this.id);
    if (!badge) {
      return;
    }
    if (this.badgeSize) {
      if (this.badgeSize === "large") {
        addClass(badge, "p-badge-lg");
        removeClass(badge, "p-badge-xl");
      }
      if (this.badgeSize === "xlarge") {
        addClass(badge, "p-badge-xl");
        removeClass(badge, "p-badge-lg");
      }
    } else if (this.size && !this.badgeSize) {
      if (this.size === "large") {
        addClass(badge, "p-badge-lg");
        removeClass(badge, "p-badge-xl");
      }
      if (this.size === "xlarge") {
        addClass(badge, "p-badge-xl");
        removeClass(badge, "p-badge-lg");
      }
    } else {
      removeClass(badge, "p-badge-lg");
      removeClass(badge, "p-badge-xl");
    }
  }
  renderBadgeContent() {
    if (this.disabled) {
      return null;
    }
    const el = this.activeElement;
    const badge = this.document.createElement("span");
    badge.id = this.id;
    badge.className = "p-badge p-component";
    this.setSeverity(null, badge);
    this.setSizeClasses(badge);
    this.setValue(badge);
    addClass(el, "p-overlay-badge");
    this.renderer.appendChild(el, badge);
    this.badgeEl = badge;
    this.applyStyles();
  }
  applyStyles() {
    if (this.badgeEl && this.badgeStyle && typeof this.badgeStyle === "object") {
      for (const [key, value] of Object.entries(this.badgeStyle)) {
        this.renderer.setStyle(this.badgeEl, key, value);
      }
    }
    if (this.badgeEl && this.badgeStyleClass) {
      this.badgeEl.classList.add(...this.badgeStyleClass.split(" "));
    }
  }
  setSeverity(oldSeverity, element) {
    const badge = element ?? this.document.getElementById(this.id);
    if (!badge) {
      return;
    }
    if (this.severity) {
      addClass(badge, `p-badge-${this.severity}`);
    }
    if (oldSeverity) {
      removeClass(badge, `p-badge-${oldSeverity}`);
    }
  }
  toggleDisableState() {
    if (!this.id) {
      return;
    }
    if (this.disabled) {
      const badge = this.activeElement?.querySelector(`#${this.id}`);
      if (badge) {
        this.renderer.removeChild(this.activeElement, badge);
      }
    } else {
      this.renderBadgeContent();
    }
  }
  static ɵfac = function BadgeDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BadgeDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _BadgeDirective,
    selectors: [["", "pBadge", ""]],
    inputs: {
      disabled: [0, "badgeDisabled", "disabled"],
      badgeSize: "badgeSize",
      size: "size",
      severity: "severity",
      value: "value",
      badgeStyle: "badgeStyle",
      badgeStyleClass: "badgeStyleClass"
    },
    features: [ɵɵProvidersFeature([BadgeStyle]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeDirective, [{
    type: Directive,
    args: [{
      selector: "[pBadge]",
      providers: [BadgeStyle],
      standalone: true
    }]
  }], () => [], {
    disabled: [{
      type: Input,
      args: ["badgeDisabled"]
    }],
    badgeSize: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    severity: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    badgeStyle: [{
      type: Input
    }],
    badgeStyleClass: [{
      type: Input
    }]
  });
})();
var Badge = class _Badge extends BaseComponent {
  /**
   * Class of the element.
   * @group Props
   */
  styleClass = input();
  /**
   * Inline style of the element.
   * @group Props
   */
  style = input();
  /**
   * Size of the badge, valid options are "large" and "xlarge".
   * @group Props
   */
  badgeSize = input();
  /**
   * Size of the badge, valid options are "large" and "xlarge".
   * @group Props
   */
  size = input();
  /**
   * Severity type of the badge.
   * @group Props
   */
  severity = input();
  /**
   * Value to display inside the badge.
   * @group Props
   */
  value = input();
  /**
   * When specified, disables the component.
   * @group Props
   */
  badgeDisabled = input(false, {
    transform: booleanAttribute
  });
  _componentStyle = inject(BadgeStyle);
  /**
   * Computes the container class for the badge element based on its properties.
   * @returns An object representing the CSS classes to be applied to the badge container.
   */
  containerClass = computed(() => {
    let classes3 = "p-badge p-component";
    if (isNotEmpty(this.value()) && String(this.value()).length === 1) {
      classes3 += " p-badge-circle";
    }
    if (this.badgeSize() === "large") {
      classes3 += " p-badge-lg";
    } else if (this.badgeSize() === "xlarge") {
      classes3 += " p-badge-xl";
    } else if (this.badgeSize() === "small") {
      classes3 += " p-badge-sm";
    }
    if (isEmpty(this.value())) {
      classes3 += " p-badge-dot";
    }
    if (this.styleClass()) {
      classes3 += ` ${this.styleClass()}`;
    }
    if (this.severity()) {
      classes3 += ` p-badge-${this.severity()}`;
    }
    return classes3;
  });
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵBadge_BaseFactory;
    return function Badge_Factory(__ngFactoryType__) {
      return (ɵBadge_BaseFactory || (ɵBadge_BaseFactory = ɵɵgetInheritedFactory(_Badge)))(__ngFactoryType__ || _Badge);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _Badge,
    selectors: [["p-badge"]],
    hostVars: 6,
    hostBindings: function Badge_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵstyleMap(ctx.style());
        ɵɵclassMap(ctx.containerClass());
        ɵɵstyleProp("display", ctx.badgeDisabled() ? "none" : null);
      }
    },
    inputs: {
      styleClass: [1, "styleClass"],
      style: [1, "style"],
      badgeSize: [1, "badgeSize"],
      size: [1, "size"],
      severity: [1, "severity"],
      value: [1, "value"],
      badgeDisabled: [1, "badgeDisabled"]
    },
    features: [ɵɵProvidersFeature([BadgeStyle]), ɵɵInheritDefinitionFeature],
    decls: 1,
    vars: 1,
    template: function Badge_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtext(0);
      }
      if (rf & 2) {
        ɵɵtextInterpolate(ctx.value());
      }
    },
    dependencies: [CommonModule, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Badge, [{
    type: Component,
    args: [{
      selector: "p-badge",
      template: `{{ value() }}`,
      standalone: true,
      imports: [CommonModule, SharedModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [BadgeStyle],
      host: {
        "[class]": "containerClass()",
        "[style.display]": 'badgeDisabled() ? "none" : null',
        "[style]": "style()"
      }
    }]
  }], null, null);
})();
var BadgeModule = class _BadgeModule {
  static ɵfac = function BadgeModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BadgeModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _BadgeModule,
    imports: [Badge, BadgeDirective, SharedModule],
    exports: [Badge, BadgeDirective, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Badge, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeModule, [{
    type: NgModule,
    args: [{
      imports: [Badge, BadgeDirective, SharedModule],
      exports: [Badge, BadgeDirective, SharedModule]
    }]
  }], null, null);
})();

// node_modules/primeng/fesm2022/primeng-ripple.mjs
var theme2 = ({
  dt
}) => `
/* For PrimeNG */
.p-ripple {
    overflow: hidden;
    position: relative;
}

.p-ink {
    display: block;
    position: absolute;
    background: ${dt("ripple.background")};
    border-radius: 100%;
    transform: scale(0);
}

.p-ink-active {
    animation: ripple 0.4s linear;
}

.p-ripple-disabled .p-ink {
    display: none !important;
}

@keyframes ripple {
    100% {
        opacity: 0;
        transform: scale(2.5);
    }
}
`;
var classes2 = {
  root: "p-ink"
};
var RippleStyle = class _RippleStyle extends BaseStyle {
  name = "ripple";
  theme = theme2;
  classes = classes2;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵRippleStyle_BaseFactory;
    return function RippleStyle_Factory(__ngFactoryType__) {
      return (ɵRippleStyle_BaseFactory || (ɵRippleStyle_BaseFactory = ɵɵgetInheritedFactory(_RippleStyle)))(__ngFactoryType__ || _RippleStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _RippleStyle,
    factory: _RippleStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RippleStyle, [{
    type: Injectable
  }], null, null);
})();
var RippleClasses;
(function(RippleClasses2) {
  RippleClasses2["root"] = "p-ink";
})(RippleClasses || (RippleClasses = {}));
var Ripple = class _Ripple extends BaseComponent {
  zone = inject(NgZone);
  _componentStyle = inject(RippleStyle);
  animationListener;
  mouseDownListener;
  timeout;
  constructor() {
    super();
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (this.config.ripple()) {
          this.zone.runOutsideAngular(() => {
            this.create();
            this.mouseDownListener = this.renderer.listen(this.el.nativeElement, "mousedown", this.onMouseDown.bind(this));
          });
        } else {
          this.remove();
        }
      }
    });
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
  }
  onMouseDown(event) {
    let ink = this.getInk();
    if (!ink || this.document.defaultView?.getComputedStyle(ink, null).display === "none") {
      return;
    }
    removeClass(ink, "p-ink-active");
    if (!getHeight(ink) && !getWidth(ink)) {
      let d = Math.max(getOuterWidth(this.el.nativeElement), getOuterHeight(this.el.nativeElement));
      ink.style.height = d + "px";
      ink.style.width = d + "px";
    }
    let offset = getOffset(this.el.nativeElement);
    let x = event.pageX - offset.left + this.document.body.scrollTop - getWidth(ink) / 2;
    let y = event.pageY - offset.top + this.document.body.scrollLeft - getHeight(ink) / 2;
    this.renderer.setStyle(ink, "top", y + "px");
    this.renderer.setStyle(ink, "left", x + "px");
    addClass(ink, "p-ink-active");
    this.timeout = setTimeout(() => {
      let ink2 = this.getInk();
      if (ink2) {
        removeClass(ink2, "p-ink-active");
      }
    }, 401);
  }
  getInk() {
    const children = this.el.nativeElement.children;
    for (let i = 0; i < children.length; i++) {
      if (typeof children[i].className === "string" && children[i].className.indexOf("p-ink") !== -1) {
        return children[i];
      }
    }
    return null;
  }
  resetInk() {
    let ink = this.getInk();
    if (ink) {
      removeClass(ink, "p-ink-active");
    }
  }
  onAnimationEnd(event) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    removeClass(event.currentTarget, "p-ink-active");
  }
  create() {
    let ink = this.renderer.createElement("span");
    this.renderer.addClass(ink, "p-ink");
    this.renderer.appendChild(this.el.nativeElement, ink);
    this.renderer.setAttribute(ink, "aria-hidden", "true");
    this.renderer.setAttribute(ink, "role", "presentation");
    if (!this.animationListener) {
      this.animationListener = this.renderer.listen(ink, "animationend", this.onAnimationEnd.bind(this));
    }
  }
  remove() {
    let ink = this.getInk();
    if (ink) {
      this.mouseDownListener && this.mouseDownListener();
      this.animationListener && this.animationListener();
      this.mouseDownListener = null;
      this.animationListener = null;
      remove(ink);
    }
  }
  ngOnDestroy() {
    if (this.config && this.config.ripple()) {
      this.remove();
    }
    super.ngOnDestroy();
  }
  static ɵfac = function Ripple_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Ripple)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _Ripple,
    selectors: [["", "pRipple", ""]],
    hostAttrs: [1, "p-ripple"],
    features: [ɵɵProvidersFeature([RippleStyle]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Ripple, [{
    type: Directive,
    args: [{
      selector: "[pRipple]",
      host: {
        class: "p-ripple"
      },
      standalone: true,
      providers: [RippleStyle]
    }]
  }], () => [], null);
})();
var RippleModule = class _RippleModule {
  static ɵfac = function RippleModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RippleModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _RippleModule,
    imports: [Ripple],
    exports: [Ripple]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RippleModule, [{
    type: NgModule,
    args: [{
      imports: [Ripple],
      exports: [Ripple]
    }]
  }], null, null);
})();

export {
  Badge,
  BadgeModule,
  Ripple
};
//# sourceMappingURL=chunk-IHZ6DZF4.js.map
