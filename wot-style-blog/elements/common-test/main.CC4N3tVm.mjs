(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".common-test[data-v-19319fe3]{color:#fff;font-size:18px}")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { MaoElementBaseHook as xe } from "@mao/core/view";
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const K = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {}, Te = process.env.NODE_ENV !== "production" ? Object.freeze([]) : [], re = () => {
}, De = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), D = Object.assign, d = Array.isArray, Fe = (e) => Q(e) === "[object Map]", Ie = (e) => Q(e) === "[object Set]", S = (e) => typeof e == "function", N = (e) => typeof e == "string", G = (e) => typeof e == "symbol", E = (e) => e !== null && typeof e == "object", se = Object.prototype.toString, Q = (e) => se.call(e), $e = (e) => Q(e) === "[object Object]";
let ne;
const H = () => ne || (ne = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function X(e) {
  if (d(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const o = e[n], s = N(o) ? je(o) : X(o);
      if (s)
        for (const r in s)
          t[r] = s[r];
    }
    return t;
  } else if (N(e) || E(e))
    return e;
}
const Pe = /;(?![^(]*\))/g, Ae = /:([^]+)/, Me = /\/\*[^]*?\*\//g;
function je(e) {
  const t = {};
  return e.replace(Me, "").split(Pe).forEach((n) => {
    if (n) {
      const o = n.split(Ae);
      o.length > 1 && (t[o[0].trim()] = o[1].trim());
    }
  }), t;
}
function Z(e) {
  let t = "";
  if (N(e))
    t = e;
  else if (d(e))
    for (let n = 0; n < e.length; n++) {
      const o = Z(e[n]);
      o && (t += o + " ");
    }
  else if (E(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const ie = (e) => !!(e && e.__v_isRef === !0), ce = (e) => N(e) ? e : e == null ? "" : d(e) || E(e) && (e.toString === se || !S(e.toString)) ? ie(e) ? ce(e.value) : JSON.stringify(e, le, 2) : String(e), le = (e, t) => ie(t) ? le(e, t.value) : Fe(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [o, s], r) => (n[z(o, r) + " =>"] = s, n),
    {}
  )
} : Ie(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => z(n))
} : G(t) ? z(t) : E(t) && !d(t) && !$e(t) ? String(t) : t, z = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    G(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
);
Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
);
Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(G)
);
function ue(e) {
  return q(e) ? ue(e.__v_raw) : !!(e && e.__v_isReactive);
}
function q(e) {
  return !!(e && e.__v_isReadonly);
}
function U(e) {
  return !!(e && e.__v_isShallow);
}
function W(e) {
  return e ? !!e.__v_raw : !1;
}
function b(e) {
  const t = e && e.__v_raw;
  return t ? b(t) : e;
}
function v(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function He(e) {
  return v(e) ? e.value : e;
}
/**
* @vue/runtime-core v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const w = [];
function ve(e) {
  w.push(e);
}
function ze() {
  w.pop();
}
let J = !1;
function R(e, ...t) {
  if (J) return;
  J = !0;
  const n = w.length ? w[w.length - 1].component : null, o = n && n.appContext.config.warnHandler, s = Ue();
  if (o)
    ee(
      o,
      n,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        e + t.map((r) => {
          var c, l;
          return (l = (c = r.toString) == null ? void 0 : c.call(r)) != null ? l : JSON.stringify(r);
        }).join(""),
        n && n.proxy,
        s.map(
          ({ vnode: r }) => `at <${ke(n, r.type)}>`
        ).join(`
`),
        s
      ]
    );
  else {
    const r = [`[Vue warn]: ${e}`, ...t];
    s.length && r.push(`
`, ...Je(s)), console.warn(...r);
  }
  J = !1;
}
function Ue() {
  let e = w[w.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const o = e.component && e.component.parent;
    e = o && o.vnode;
  }
  return t;
}
function Je(e) {
  const t = [];
  return e.forEach((n, o) => {
    t.push(...o === 0 ? [] : [`
`], ...Le(n));
  }), t;
}
function Le({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", o = e.component ? e.component.parent == null : !1, s = ` at <${ke(
    e.component,
    e.type,
    o
  )}`, r = ">" + n;
  return e.props ? [s, ...Be(e.props), r] : [s + r];
}
function Be(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((o) => {
    t.push(...ae(o, e[o]));
  }), n.length > 3 && t.push(" ..."), t;
}
function ae(e, t, n) {
  return N(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : v(t) ? (t = ae(e, b(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : S(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = b(t), n ? t : [`${e}=`, t]);
}
const fe = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  0: "setup function",
  1: "render function",
  2: "watcher getter",
  3: "watcher callback",
  4: "watcher cleanup function",
  5: "native event handler",
  6: "component event handler",
  7: "vnode hook",
  8: "directive hook",
  9: "transition hook",
  10: "app errorHandler",
  11: "app warnHandler",
  12: "ref function",
  13: "async component loader",
  14: "scheduler flush",
  15: "component update",
  16: "app unmount cleanup function"
};
function ee(e, t, n, o) {
  try {
    return o ? e(...o) : e();
  } catch (s) {
    pe(s, t, n);
  }
}
function pe(e, t, n, o = !0) {
  const s = t ? t.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: c } = t && t.appContext.config || K;
  if (t) {
    let l = t.parent;
    const u = t.proxy, _ = process.env.NODE_ENV !== "production" ? fe[n] : `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const g = l.ec;
      if (g) {
        for (let i = 0; i < g.length; i++)
          if (g[i](e, u, _) === !1)
            return;
      }
      l = l.parent;
    }
    if (r) {
      ee(r, null, 10, [
        e,
        u,
        _
      ]);
      return;
    }
  }
  Ke(e, n, s, o, c);
}
function Ke(e, t, n, o = !0, s = !1) {
  if (process.env.NODE_ENV !== "production") {
    const r = fe[t];
    if (n && ve(n), R(`Unhandled error${r ? ` during execution of ${r}` : ""}`), n && ze(), o)
      throw e;
    console.error(e);
  } else {
    if (s)
      throw e;
    console.error(e);
  }
}
const p = [];
let y = -1;
const k = [];
let O = null, V = 0;
const qe = /* @__PURE__ */ Promise.resolve();
let Y = null;
const We = 100;
function Ye(e) {
  let t = y + 1, n = p.length;
  for (; t < n; ) {
    const o = t + n >>> 1, s = p[o], r = T(s);
    r < e || r === e && s.flags & 2 ? t = o + 1 : n = o;
  }
  return t;
}
function Ge(e) {
  if (!(e.flags & 1)) {
    const t = T(e), n = p[p.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= T(n) ? p.push(e) : p.splice(Ye(t), 0, e), e.flags |= 1, de();
  }
}
function de() {
  Y || (Y = qe.then(me));
}
function Qe(e) {
  d(e) ? k.push(...e) : O && e.id === -1 ? O.splice(V + 1, 0, e) : e.flags & 1 || (k.push(e), e.flags |= 1), de();
}
function Xe(e) {
  if (k.length) {
    const t = [...new Set(k)].sort(
      (n, o) => T(n) - T(o)
    );
    if (k.length = 0, O) {
      O.push(...t);
      return;
    }
    for (O = t, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), V = 0; V < O.length; V++) {
      const n = O[V];
      process.env.NODE_ENV !== "production" && _e(e, n) || (n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2);
    }
    O = null, V = 0;
  }
}
const T = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function me(e) {
  process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map());
  const t = process.env.NODE_ENV !== "production" ? (n) => _e(e, n) : re;
  try {
    for (y = 0; y < p.length; y++) {
      const n = p[y];
      if (n && !(n.flags & 8)) {
        if (process.env.NODE_ENV !== "production" && t(n))
          continue;
        n.flags & 4 && (n.flags &= -2), ee(
          n,
          n.i,
          n.i ? 15 : 14
        ), n.flags & 4 || (n.flags &= -2);
      }
    }
  } finally {
    for (; y < p.length; y++) {
      const n = p[y];
      n && (n.flags &= -2);
    }
    y = -1, p.length = 0, Xe(e), Y = null, (p.length || k.length) && me(e);
  }
}
function _e(e, t) {
  const n = e.get(t) || 0;
  if (n > We) {
    const o = t.i, s = o && Ce(o.type);
    return pe(
      `Maximum recursive updates exceeded${s ? ` in component <${s}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
      null,
      10
    ), !0;
  }
  return e.set(t, n + 1), !1;
}
const L = /* @__PURE__ */ new Map();
process.env.NODE_ENV !== "production" && (H().__VUE_HMR_RUNTIME__ = {
  createRecord: B(Ze),
  rerender: B(et),
  reload: B(tt)
});
const P = /* @__PURE__ */ new Map();
function Ze(e, t) {
  return P.has(e) ? !1 : (P.set(e, {
    initialDef: A(t),
    instances: /* @__PURE__ */ new Set()
  }), !0);
}
function A(e) {
  return Re(e) ? e.__vccOpts : e;
}
function et(e, t) {
  const n = P.get(e);
  n && (n.initialDef.render = t, [...n.instances].forEach((o) => {
    t && (o.render = t, A(o.type).render = t), o.renderCache = [], o.update();
  }));
}
function tt(e, t) {
  const n = P.get(e);
  if (!n) return;
  t = A(t), oe(n.initialDef, t);
  const o = [...n.instances];
  for (let s = 0; s < o.length; s++) {
    const r = o[s], c = A(r.type);
    let l = L.get(c);
    l || (c !== n.initialDef && oe(c, t), L.set(c, l = /* @__PURE__ */ new Set())), l.add(r), r.appContext.propsCache.delete(r.type), r.appContext.emitsCache.delete(r.type), r.appContext.optionsCache.delete(r.type), r.ceReload ? (l.add(r), r.ceReload(t.styles), l.delete(r)) : r.parent ? Ge(() => {
      r.parent.update(), l.delete(r);
    }) : r.appContext.reload ? r.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn(
      "[HMR] Root or manually mounted instance modified. Full reload required."
    ), r.root.ce && r !== r.root && r.root.ce._removeChildStyle(c);
  }
  Qe(() => {
    L.clear();
  });
}
function oe(e, t) {
  D(e, t);
  for (const n in e)
    n !== "__file" && !(n in t) && delete e[n];
}
function B(e) {
  return (t, n) => {
    try {
      return e(t, n);
    } catch (o) {
      console.error(o), console.warn(
        "[HMR] Something went wrong during Vue component hot-reload. Full reload required."
      );
    }
  };
}
let C, F = [];
function he(e, t) {
  var n, o;
  C = e, C ? (C.enabled = !0, F.forEach(({ event: s, args: r }) => C.emit(s, ...r)), F = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((o = (n = window.navigator) == null ? void 0 : n.userAgent) != null && o.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((r) => {
    he(r, t);
  }), setTimeout(() => {
    C || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, F = []);
  }, 3e3)) : F = [];
}
let M = null, nt = null;
const ot = (e) => e.__isTeleport;
function ge(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, ge(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function rt(e, t) {
  return S(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    D({ name: e.name }, t, { setup: e })
  ) : e;
}
H().requestIdleCallback;
H().cancelIdleCallback;
const st = Symbol.for("v-ndc"), it = {};
process.env.NODE_ENV !== "production" && (it.ownKeys = (e) => (R(
  "Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."
), Reflect.ownKeys(e)));
const ct = {}, ye = (e) => Object.getPrototypeOf(e) === ct, lt = (e) => e.__isSuspense, Ee = Symbol.for("v-fgt"), ut = Symbol.for("v-txt"), at = Symbol.for("v-cmt"), I = [];
let m = null;
function Ne(e = !1) {
  I.push(m = e ? null : []);
}
function ft() {
  I.pop(), m = I[I.length - 1] || null;
}
function pt(e) {
  return e.dynamicChildren = m || Te, ft(), m && m.push(e), e;
}
function Se(e, t, n, o, s, r) {
  return pt(
    be(
      e,
      t,
      n,
      o,
      s,
      r,
      !0
    )
  );
}
function dt(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
const mt = (...e) => we(
  ...e
), Oe = ({ key: e }) => e ?? null, $ = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? N(e) || v(e) || S(e) ? { i: M, r: e, k: t, f: !!n } : e : null);
function be(e, t = null, n = null, o = 0, s = null, r = e === Ee ? 0 : 1, c = !1, l = !1) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Oe(t),
    ref: t && $(t),
    scopeId: nt,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: r,
    patchFlag: o,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: M
  };
  return l ? (te(u, n), r & 128 && e.normalize(u)) : n && (u.shapeFlag |= N(n) ? 8 : 16), process.env.NODE_ENV !== "production" && u.key !== u.key && R("VNode created with invalid key (NaN). VNode type:", u.type), // avoid a block node from tracking itself
  !c && // has current parent block
  m && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (u.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  u.patchFlag !== 32 && m.push(u), u;
}
const _t = process.env.NODE_ENV !== "production" ? mt : we;
function we(e, t = null, n = null, o = 0, s = null, r = !1) {
  if ((!e || e === st) && (process.env.NODE_ENV !== "production" && !e && R(`Invalid vnode type when creating vnode: ${e}.`), e = at), dt(e)) {
    const l = j(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && te(l, n), !r && m && (l.shapeFlag & 6 ? m[m.indexOf(e)] = l : m.push(l)), l.patchFlag = -2, l;
  }
  if (Re(e) && (e = e.__vccOpts), t) {
    t = ht(t);
    let { class: l, style: u } = t;
    l && !N(l) && (t.class = Z(l)), E(u) && (W(u) && !d(u) && (u = D({}, u)), t.style = X(u));
  }
  const c = N(e) ? 1 : lt(e) ? 128 : ot(e) ? 64 : E(e) ? 4 : S(e) ? 2 : 0;
  return process.env.NODE_ENV !== "production" && c & 4 && W(e) && (e = b(e), R(
    "Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.",
    `
Component that was made reactive: `,
    e
  )), be(
    e,
    t,
    n,
    o,
    s,
    c,
    r,
    !0
  );
}
function ht(e) {
  return e ? W(e) || ye(e) ? D({}, e) : e : null;
}
function j(e, t, n = !1, o = !1) {
  const { props: s, ref: r, patchFlag: c, children: l, transition: u } = e, _ = t ? yt(s || {}, t) : s, g = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: _,
    key: _ && Oe(_),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? d(r) ? r.concat($(t)) : [r, $(t)] : $(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: process.env.NODE_ENV !== "production" && c === -1 && d(l) ? l.map(Ve) : l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Ee ? c === -1 ? 16 : c | 16 : c,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: u,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && j(e.ssContent),
    ssFallback: e.ssFallback && j(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return u && o && ge(
    g,
    u.clone(g)
  ), g;
}
function Ve(e) {
  const t = j(e);
  return d(e.children) && (t.children = e.children.map(Ve)), t;
}
function gt(e = " ", t = 0) {
  return _t(ut, null, e, t);
}
function te(e, t) {
  let n = 0;
  const { shapeFlag: o } = e;
  if (t == null)
    t = null;
  else if (d(t))
    n = 16;
  else if (typeof t == "object")
    if (o & 65) {
      const s = t.default;
      s && (s._c && (s._d = !1), te(e, s()), s._c && (s._d = !0));
      return;
    } else
      n = 32, !t._ && !ye(t) && (t._ctx = M);
  else S(t) ? (t = { default: t, _ctx: M }, n = 32) : (t = String(t), o & 64 ? (n = 16, t = [gt(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function yt(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    for (const s in o)
      if (s === "class")
        t.class !== o.class && (t.class = Z([t.class, o.class]));
      else if (s === "style")
        t.style = X([t.style, o.style]);
      else if (De(s)) {
        const r = t[s], c = o[s];
        c && r !== c && !(d(r) && r.includes(c)) && (t[s] = r ? [].concat(r, c) : c);
      } else s !== "" && (t[s] = o[s]);
  }
  return t;
}
{
  const e = H(), t = (n, o) => {
    let s;
    return (s = e[n]) || (s = e[n] = []), s.push(o), (r) => {
      s.length > 1 ? s.forEach((c) => c(r)) : s[0](r);
    };
  };
  t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => n
  ), t(
    "__VUE_SSR_SETTERS__",
    (n) => n
  );
}
process.env.NODE_ENV;
const Et = /(?:^|[-_])(\w)/g, Nt = (e) => e.replace(Et, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function Ce(e, t = !0) {
  return S(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function ke(e, t, n = !1) {
  let o = Ce(t);
  if (!o && t.__file) {
    const s = t.__file.match(/([^/\\]+)\.\w+$/);
    s && (o = s[1]);
  }
  if (!o && e && e.parent) {
    const s = (r) => {
      for (const c in r)
        if (r[c] === t)
          return c;
    };
    o = s(
      e.components || e.parent.type.components
    ) || s(e.appContext.components);
  }
  return o ? Nt(o) : n ? "App" : "Anonymous";
}
function Re(e) {
  return S(e) && "__vccOpts" in e;
}
function St() {
  if (process.env.NODE_ENV === "production" || typeof window > "u")
    return;
  const e = { style: "color:#3ba776" }, t = { style: "color:#1677ff" }, n = { style: "color:#f5222d" }, o = { style: "color:#eb2f96" }, s = {
    __vue_custom_formatter: !0,
    header(i) {
      return E(i) ? i.__isVue ? ["div", e, "VueInstance"] : v(i) ? [
        "div",
        {},
        ["span", e, g(i)],
        "<",
        // avoid debugger accessing value affecting behavior
        l("_value" in i ? i._value : i),
        ">"
      ] : ue(i) ? [
        "div",
        {},
        ["span", e, U(i) ? "ShallowReactive" : "Reactive"],
        "<",
        l(i),
        `>${q(i) ? " (readonly)" : ""}`
      ] : q(i) ? [
        "div",
        {},
        ["span", e, U(i) ? "ShallowReadonly" : "Readonly"],
        "<",
        l(i),
        ">"
      ] : null : null;
    },
    hasBody(i) {
      return i && i.__isVue;
    },
    body(i) {
      if (i && i.__isVue)
        return [
          "div",
          {},
          ...r(i.$)
        ];
    }
  };
  function r(i) {
    const a = [];
    i.type.props && i.props && a.push(c("props", b(i.props))), i.setupState !== K && a.push(c("setup", i.setupState)), i.data !== K && a.push(c("data", b(i.data)));
    const f = u(i, "computed");
    f && a.push(c("computed", f));
    const h = u(i, "inject");
    return h && a.push(c("injected", h)), a.push([
      "div",
      {},
      [
        "span",
        {
          style: o.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: i }]
    ]), a;
  }
  function c(i, a) {
    return a = D({}, a), Object.keys(a).length ? [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        i
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(a).map((f) => [
          "div",
          {},
          ["span", o, f + ": "],
          l(a[f], !1)
        ])
      ]
    ] : ["span", {}];
  }
  function l(i, a = !0) {
    return typeof i == "number" ? ["span", t, i] : typeof i == "string" ? ["span", n, JSON.stringify(i)] : typeof i == "boolean" ? ["span", o, i] : E(i) ? ["object", { object: a ? b(i) : i }] : ["span", n, String(i)];
  }
  function u(i, a) {
    const f = i.type;
    if (S(f))
      return;
    const h = {};
    for (const x in i.ctx)
      _(f, x, a) && (h[x] = i.ctx[x]);
    return h;
  }
  function _(i, a, f) {
    const h = i[f];
    if (d(h) && h.includes(a) || E(h) && a in h || i.extends && _(i.extends, a, f) || i.mixins && i.mixins.some((x) => _(x, a, f)))
      return !0;
  }
  function g(i) {
    return U(i) ? "ShallowRef" : i.effect ? "ComputedRef" : "Ref";
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(s) : window.devtoolsFormatters = [s];
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
/**
* vue v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Ot() {
  St();
}
process.env.NODE_ENV !== "production" && Ot();
const bt = { class: "el-common-text" }, wt = /* @__PURE__ */ rt({
  __name: "view",
  setup(e) {
    const { MaoProp: t } = xe(), n = t("text");
    return (o, s) => (Ne(), Se("div", bt, ce(He(n)), 1));
  }
}), Vt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, s] of t)
    n[o] = s;
  return n;
}, Ct = {}, kt = { class: "common-test" };
function Rt(e, t) {
  return Ne(), Se("div", kt, "这是测试解耦组件的控制面板");
}
const xt = /* @__PURE__ */ Vt(Ct, [["render", Rt], ["__scopeId", "data-v-19319fe3"]]), Tt = "@mao-elements/common-test", Dt = "测试解耦组件", Ft = "Test", It = "1.0.0", $t = "common", Pt = "测试解耦组件", At = "main.ts", Mt = ["zhangxiaohui"], jt = { "@mao/core": "workspace:^1.0.0" }, Ht = { "@vitejs/plugin-legacy": "^5.4.1", "@vitejs/plugin-vue": "^5.0.5", "@vitejs/plugin-vue-jsx": "^4.0.0", vite: "^5.3.4", "vite-plugin-cdn-import": "^1.0.1", "vite-plugin-compression": "^0.5.1", "vite-plugin-css-injected-by-js": "^3.5.2", "vite-plugin-eslint": "^1.8.1", "vite-plugin-html": "^3.2.2", "vite-plugin-svg-icons": "^2.0.1", "vite-plugin-vue-setup-extend": "^0.4.0" }, vt = {
  name: Tt,
  cname: Dt,
  ename: Ft,
  version: It,
  group: $t,
  description: Pt,
  main: At,
  contributors: Mt,
  dependencies: jt,
  devDependencies: Ht
}, zt = {
  props: {
    text: {
      type: String,
      default: ""
    }
  }
};
try {
  window.MAO.registerElement({
    manifest: vt,
    config: zt,
    control: xt,
    view: wt
  });
} catch (e) {
  console.error(e);
}
