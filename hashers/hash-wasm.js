/*!
 * hash-wasm (https://www.npmjs.com/package/hash-wasm)
 * (c) Dani Biro
 * @license MIT
 */

!(function (A, I) {
  "object" == typeof exports && "undefined" != typeof module
    ? I(exports)
    : "function" == typeof define && define.amd
      ? define(["exports"], I)
      : I(
          ((A =
            "undefined" != typeof globalThis
              ? globalThis
              : A || self).hashwasm = A.hashwasm || {}),
        );
})(this, function (A) {
  "use strict";
  function I(A, I, i, g) {
    return new (i || (i = Promise))(function (B, e) {
      function n(A) {
        try {
          Q(g.next(A));
        } catch (A) {
          e(A);
        }
      }
      function c(A) {
        try {
          Q(g.throw(A));
        } catch (A) {
          e(A);
        }
      }
      function Q(A) {
        var I;
        A.done
          ? B(A.value)
          : ((I = A.value),
            I instanceof i
              ? I
              : new i(function (A) {
                  A(I);
                })).then(n, c);
      }
      Q((g = g.apply(A, I || [])).next());
    });
  }
  "function" == typeof SuppressedError && SuppressedError;
  class i {
    constructor() {
      this.mutex = Promise.resolve();
    }
    lock() {
      let A = () => {};
      return (
        (this.mutex = this.mutex.then(() => new Promise(A))),
        new Promise((I) => {
          A = I;
        })
      );
    }
    dispatch(A) {
      return I(this, void 0, void 0, function* () {
        const I = yield this.lock();
        try {
          return yield Promise.resolve(A());
        } finally {
          I();
        }
      });
    }
  }
  var g;
  const B =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof self
          ? self
          : "undefined" != typeof window
            ? window
            : global,
    e = null !== (g = B.Buffer) && void 0 !== g ? g : null,
    n = B.TextEncoder ? new B.TextEncoder() : null;
  function c(A, I) {
    return (
      (((15 & A) + ((A >> 6) | ((A >> 3) & 8))) << 4) |
      ((15 & I) + ((I >> 6) | ((I >> 3) & 8)))
    );
  }
  const Q = "a".charCodeAt(0) - 10,
    t = "0".charCodeAt(0);
  function o(A, I, i) {
    let g = 0;
    for (let B = 0; B < i; B++) {
      let i = I[B] >>> 4;
      (A[g++] = i > 9 ? i + Q : i + t),
        (i = 15 & I[B]),
        (A[g++] = i > 9 ? i + Q : i + t);
    }
    return String.fromCharCode.apply(null, A);
  }
  const a =
      null !== e
        ? (A) => {
            if ("string" == typeof A) {
              const I = e.from(A, "utf8");
              return new Uint8Array(I.buffer, I.byteOffset, I.length);
            }
            if (e.isBuffer(A))
              return new Uint8Array(A.buffer, A.byteOffset, A.length);
            if (ArrayBuffer.isView(A))
              return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
            throw new Error("Invalid data type!");
          }
        : (A) => {
            if ("string" == typeof A) return n.encode(A);
            if (ArrayBuffer.isView(A))
              return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
            throw new Error("Invalid data type!");
          },
    E = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    r = new Uint8Array(256);
  for (let A = 0; A < E.length; A++) r[E.charCodeAt(A)] = A;
  function d(A) {
    const I = (function (A) {
        let I = Math.floor(0.75 * A.length);
        const i = A.length;
        return "=" === A[i - 1] && ((I -= 1), "=" === A[i - 2] && (I -= 1)), I;
      })(A),
      i = A.length,
      g = new Uint8Array(I);
    let B = 0;
    for (let I = 0; I < i; I += 4) {
      const i = r[A.charCodeAt(I)],
        e = r[A.charCodeAt(I + 1)],
        n = r[A.charCodeAt(I + 2)],
        c = r[A.charCodeAt(I + 3)];
      (g[B] = (i << 2) | (e >> 4)),
        (B += 1),
        (g[B] = ((15 & e) << 4) | (n >> 2)),
        (B += 1),
        (g[B] = ((3 & n) << 6) | (63 & c)),
        (B += 1);
    }
    return g;
  }
  const y = 16384,
    C = new i(),
    h = new Map();
  function s(A, i) {
    return I(this, void 0, void 0, function* () {
      let g = null,
        B = null,
        e = !1;
      if ("undefined" == typeof WebAssembly)
        throw new Error("WebAssembly is not supported in this environment!");
      const n = () =>
          new DataView(g.exports.memory.buffer).getUint32(
            g.exports.STATE_SIZE,
            !0,
          ),
        Q = C.dispatch(() =>
          I(this, void 0, void 0, function* () {
            if (!h.has(A.name)) {
              const I = d(A.data),
                i = WebAssembly.compile(I);
              h.set(A.name, i);
            }
            const I = yield h.get(A.name);
            g = yield WebAssembly.instantiate(I, {});
          }),
        ),
        t = (A = null) => {
          (e = !0), g.exports.Hash_Init(A);
        },
        E = (A) => {
          if (!e) throw new Error("update() called before init()");
          ((A) => {
            let I = 0;
            for (; I < A.length; ) {
              const i = A.subarray(I, I + y);
              (I += i.length), B.set(i), g.exports.Hash_Update(i.length);
            }
          })(a(A));
        },
        r = new Uint8Array(2 * i),
        s = (A, I = null) => {
          if (!e) throw new Error("digest() called before init()");
          return (
            (e = !1),
            g.exports.Hash_Final(I),
            "binary" === A ? B.slice(0, i) : o(r, B, i)
          );
        },
        F = (A) => ("string" == typeof A ? A.length < 4096 : A.byteLength < y);
      let f = F;
      switch (A.name) {
        case "argon2":
        case "scrypt":
          f = () => !0;
          break;
        case "blake2b":
        case "blake2s":
          f = (A, I) => I <= 512 && F(A);
          break;
        case "blake3":
          f = (A, I) => 0 === I && F(A);
          break;
        case "xxhash64":
        case "xxhash3":
        case "xxhash128":
          f = () => !1;
      }
      return (
        yield (() =>
          I(this, void 0, void 0, function* () {
            g || (yield Q);
            const A = g.exports.Hash_GetBuffer(),
              I = g.exports.memory.buffer;
            B = new Uint8Array(I, A, y);
          }))(),
        {
          getMemory: () => B,
          writeMemory: (A, I = 0) => {
            B.set(A, I);
          },
          getExports: () => g.exports,
          setMemorySize: (A) => {
            g.exports.Hash_SetMemorySize(A);
            const I = g.exports.Hash_GetBuffer(),
              i = g.exports.memory.buffer;
            B = new Uint8Array(i, I, A);
          },
          init: t,
          update: E,
          digest: s,
          save: () => {
            if (!e)
              throw new Error(
                "save() can only be called after init() and before digest()",
              );
            const I = g.exports.Hash_GetState(),
              i = n(),
              B = g.exports.memory.buffer,
              Q = new Uint8Array(B, I, i),
              t = new Uint8Array(4 + i);
            return (
              (function (A, I) {
                const i = I.length >> 1;
                for (let g = 0; g < i; g++) {
                  const i = g << 1;
                  A[g] = c(I.charCodeAt(i), I.charCodeAt(i + 1));
                }
              })(t, A.hash),
              t.set(Q, 4),
              t
            );
          },
          load: (I) => {
            if (!(I instanceof Uint8Array))
              throw new Error(
                "load() expects an Uint8Array generated by save()",
              );
            const i = g.exports.Hash_GetState(),
              B = n(),
              Q = 4 + B,
              t = g.exports.memory.buffer;
            if (I.length !== Q)
              throw new Error(
                `Bad state length (expected ${Q} bytes, got ${I.length})`,
              );
            if (
              !(function (A, I) {
                if (A.length !== 2 * I.length) return !1;
                for (let i = 0; i < I.length; i++) {
                  const g = i << 1;
                  if (I[i] !== c(A.charCodeAt(g), A.charCodeAt(g + 1)))
                    return !1;
                }
                return !0;
              })(A.hash, I.subarray(0, 4))
            )
              throw new Error(
                "This state was written by an incompatible hash implementation",
              );
            const o = I.subarray(4);
            new Uint8Array(t, i, B).set(o), (e = !0);
          },
          calculate: (A, I = null, e = null) => {
            if (!f(A, I)) return t(I), E(A), s("hex", e);
            const n = a(A);
            return (
              B.set(n), g.exports.Hash_Calculate(n.length, I, e), o(r, B, i)
            );
          },
          hashLength: i,
        }
      );
    });
  }
  var F = {
    name: "sha1",
    data: "AGFzbQEAAAABEQRgAAF/YAF/AGAAAGACf38AAwkIAAECAwECAAEFBAEBAgIGDgJ/AUHgiQULfwBBgAgLB3AIBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAILSGFzaF9VcGRhdGUABApIYXNoX0ZpbmFsAAUNSGFzaF9HZXRTdGF0ZQAGDkhhc2hfQ2FsY3VsYXRlAAcKU1RBVEVfU0laRQMBCpoqCAUAQYAJC68iCgF+An8BfgF/AX4DfwF+AX8Bfkd/QQAgACkDECIBQiCIpyICQRh0IAJBgP4DcUEIdHIgAUIoiKdBgP4DcSABQjiIp3JyIgMgACkDCCIEQiCIpyICQRh0IAJBgP4DcUEIdHIgBEIoiKdBgP4DcSAEQjiIp3JyIgVzIAApAygiBkIgiKciAkEYdCACQYD+A3FBCHRyIAZCKIinQYD+A3EgBkI4iKdyciIHcyAEpyICQRh0IAJBgP4DcUEIdHIgAkEIdkGA/gNxIAJBGHZyciIIIAApAwAiBKciAkEYdCACQYD+A3FBCHRyIAJBCHZBgP4DcSACQRh2cnIiCXMgACkDICIKpyICQRh0IAJBgP4DcUEIdHIgAkEIdkGA/gNxIAJBGHZyciILcyAAKQMwIgxCIIinIgJBGHQgAkGA/gNxQQh0ciAMQiiIp0GA/gNxIAxCOIincnIiAnNBAXciDXNBAXciDiAFIARCIIinIg9BGHQgD0GA/gNxQQh0ciAEQiiIp0GA/gNxIARCOIincnIiEHMgCkIgiKciD0EYdCAPQYD+A3FBCHRyIApCKIinQYD+A3EgCkI4iKdyciIRcyAAKQM4IgSnIg9BGHQgD0GA/gNxQQh0ciAPQQh2QYD+A3EgD0EYdnJyIg9zQQF3IhJzIAcgEXMgEnMgCyAAKQMYIgqnIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyIhNzIA9zIA5zQQF3IgBzQQF3IhRzIA0gD3MgAHMgAiAHcyAOcyAGpyIVQRh0IBVBgP4DcUEIdHIgFUEIdkGA/gNxIBVBGHZyciIWIAtzIA1zIApCIIinIhVBGHQgFUGA/gNxQQh0ciAKQiiIp0GA/gNxIApCOIincnIiFyADcyACcyABpyIVQRh0IBVBgP4DcUEIdHIgFUEIdkGA/gNxIBVBGHZyciIYIAhzIBZzIARCIIinIhVBGHQgFUGA/gNxQQh0ciAEQiiIp0GA/gNxIARCOIincnIiFXNBAXciGXNBAXciGnNBAXciG3NBAXciHHNBAXciHXNBAXciHiASIBVzIBEgF3MgFXMgEyAYcyAMpyIfQRh0IB9BgP4DcUEIdHIgH0EIdkGA/gNxIB9BGHZyciIgcyASc0EBdyIfc0EBdyIhcyAPICBzIB9zIBRzQQF3IiJzQQF3IiNzIBQgIXMgI3MgACAfcyAicyAec0EBdyIkc0EBdyIlcyAdICJzICRzIBwgFHMgHnMgGyAAcyAdcyAaIA5zIBxzIBkgDXMgG3MgFSACcyAacyAgIBZzIBlzICFzQQF3IiZzQQF3IidzQQF3IihzQQF3IilzQQF3IipzQQF3IitzQQF3IixzQQF3Ii0gIyAncyAhIBpzICdzIB8gGXMgJnMgI3NBAXciLnNBAXciL3MgIiAmcyAucyAlc0EBdyIwc0EBdyIxcyAlIC9zIDFzICQgLnMgMHMgLXNBAXciMnNBAXciM3MgLCAwcyAycyArICVzIC1zICogJHMgLHMgKSAecyArcyAoIB1zICpzICcgHHMgKXMgJiAbcyAocyAvc0EBdyI0c0EBdyI1c0EBdyI2c0EBdyI3c0EBdyI4c0EBdyI5c0EBdyI6c0EBdyI7IDEgNXMgLyApcyA1cyAuIChzIDRzIDFzQQF3IjxzQQF3Ij1zIDAgNHMgPHMgM3NBAXciPnNBAXciP3MgMyA9cyA/cyAyIDxzID5zIDtzQQF3IkBzQQF3IkFzIDogPnMgQHMgOSAzcyA7cyA4IDJzIDpzIDcgLXMgOXMgNiAscyA4cyA1ICtzIDdzIDQgKnMgNnMgPXNBAXciQnNBAXciQ3NBAXciRHNBAXciRXNBAXciRnNBAXciR3NBAXciSHNBAXciSSA+IEJzIDwgNnMgQnMgP3NBAXciSnMgQXNBAXciSyA9IDdzIENzIEpzQQF3IkwgRCA5IDIgMSA0ICkgHSAUIB8gFSAWQQAoAoCJASJNQQV3QQAoApCJASJOaiAJakEAKAKMiQEiT0EAKAKIiQEiCXNBACgChIkBIlBxIE9zakGZ84nUBWoiUUEedyJSIANqIFBBHnciAyAFaiBPIAMgCXMgTXEgCXNqIBBqIFFBBXdqQZnzidQFaiIQIFIgTUEedyIFc3EgBXNqIAkgCGogUSADIAVzcSADc2ogEEEFd2pBmfOJ1AVqIlFBBXdqQZnzidQFaiJTIFFBHnciAyAQQR53IghzcSAIc2ogBSAYaiBRIAggUnNxIFJzaiBTQQV3akGZ84nUBWoiBUEFd2pBmfOJ1AVqIhhBHnciUmogU0EedyIWIAtqIAggE2ogBSAWIANzcSADc2ogGEEFd2pBmfOJ1AVqIgggUiAFQR53IgtzcSALc2ogAyAXaiAYIAsgFnNxIBZzaiAIQQV3akGZ84nUBWoiBUEFd2pBmfOJ1AVqIhMgBUEedyIWIAhBHnciA3NxIANzaiALIBFqIAUgAyBSc3EgUnNqIBNBBXdqQZnzidQFaiIRQQV3akGZ84nUBWoiUkEedyILaiACIBNBHnciFWogByADaiARIBUgFnNxIBZzaiBSQQV3akGZ84nUBWoiByALIBFBHnciAnNxIAJzaiAgIBZqIFIgAiAVc3EgFXNqIAdBBXdqQZnzidQFaiIRQQV3akGZ84nUBWoiFiARQR53IhUgB0EedyIHc3EgB3NqIA8gAmogESAHIAtzcSALc2ogFkEFd2pBmfOJ1AVqIgtBBXdqQZnzidQFaiIRQR53IgJqIBIgFWogESALQR53Ig8gFkEedyISc3EgEnNqIA0gB2ogCyASIBVzcSAVc2ogEUEFd2pBmfOJ1AVqIg1BBXdqQZnzidQFaiIVQR53Ih8gDUEedyIHcyAZIBJqIA0gAiAPc3EgD3NqIBVBBXdqQZnzidQFaiINc2ogDiAPaiAVIAcgAnNxIAJzaiANQQV3akGZ84nUBWoiAkEFd2pBodfn9gZqIg5BHnciD2ogACAfaiACQR53IgAgDUEedyINcyAOc2ogGiAHaiANIB9zIAJzaiAOQQV3akGh1+f2BmoiAkEFd2pBodfn9gZqIg5BHnciEiACQR53IhRzICEgDWogDyAAcyACc2ogDkEFd2pBodfn9gZqIgJzaiAbIABqIBQgD3MgDnNqIAJBBXdqQaHX5/YGaiIAQQV3akGh1+f2BmoiDUEedyIOaiAcIBJqIABBHnciDyACQR53IgJzIA1zaiAmIBRqIAIgEnMgAHNqIA1BBXdqQaHX5/YGaiIAQQV3akGh1+f2BmoiDUEedyISIABBHnciFHMgIiACaiAOIA9zIABzaiANQQV3akGh1+f2BmoiAHNqICcgD2ogFCAOcyANc2ogAEEFd2pBodfn9gZqIgJBBXdqQaHX5/YGaiINQR53Ig5qICggEmogAkEedyIPIABBHnciAHMgDXNqICMgFGogACAScyACc2ogDUEFd2pBodfn9gZqIgJBBXdqQaHX5/YGaiINQR53IhIgAkEedyIUcyAeIABqIA4gD3MgAnNqIA1BBXdqQaHX5/YGaiIAc2ogLiAPaiAUIA5zIA1zaiAAQQV3akGh1+f2BmoiAkEFd2pBodfn9gZqIg1BHnciDmogKiAAQR53IgBqIA4gAkEedyIPcyAkIBRqIAAgEnMgAnNqIA1BBXdqQaHX5/YGaiIUc2ogLyASaiAPIABzIA1zaiAUQQV3akGh1+f2BmoiDUEFd2pBodfn9gZqIgAgDUEedyICciAUQR53IhJxIAAgAnFyaiAlIA9qIBIgDnMgDXNqIABBBXdqQaHX5/YGaiINQQV3akHc+e74eGoiDkEedyIPaiA1IABBHnciAGogKyASaiANIAByIAJxIA0gAHFyaiAOQQV3akHc+e74eGoiEiAPciANQR53Ig1xIBIgD3FyaiAwIAJqIA4gDXIgAHEgDiANcXJqIBJBBXdqQdz57vh4aiIAQQV3akHc+e74eGoiAiAAQR53Ig5yIBJBHnciEnEgAiAOcXJqICwgDWogACASciAPcSAAIBJxcmogAkEFd2pB3Pnu+HhqIgBBBXdqQdz57vh4aiINQR53Ig9qIDwgAkEedyICaiA2IBJqIAAgAnIgDnEgACACcXJqIA1BBXdqQdz57vh4aiISIA9yIABBHnciAHEgEiAPcXJqIC0gDmogDSAAciACcSANIABxcmogEkEFd2pB3Pnu+HhqIgJBBXdqQdz57vh4aiINIAJBHnciDnIgEkEedyIScSANIA5xcmogNyAAaiACIBJyIA9xIAIgEnFyaiANQQV3akHc+e74eGoiAEEFd2pB3Pnu+HhqIgJBHnciD2ogMyANQR53Ig1qID0gEmogACANciAOcSAAIA1xcmogAkEFd2pB3Pnu+HhqIhIgD3IgAEEedyIAcSASIA9xcmogOCAOaiACIAByIA1xIAIgAHFyaiASQQV3akHc+e74eGoiAkEFd2pB3Pnu+HhqIg0gAkEedyIOciASQR53IhJxIA0gDnFyaiBCIABqIAIgEnIgD3EgAiAScXJqIA1BBXdqQdz57vh4aiIAQQV3akHc+e74eGoiAkEedyIPaiBDIA5qIAIgAEEedyIUciANQR53Ig1xIAIgFHFyaiA+IBJqIAAgDXIgDnEgACANcXJqIAJBBXdqQdz57vh4aiIAQQV3akHc+e74eGoiAkEedyISIABBHnciDnMgOiANaiAAIA9yIBRxIAAgD3FyaiACQQV3akHc+e74eGoiAHNqID8gFGogAiAOciAPcSACIA5xcmogAEEFd2pB3Pnu+HhqIgJBBXdqQdaDi9N8aiINQR53Ig9qIEogEmogAkEedyIUIABBHnciAHMgDXNqIDsgDmogACAScyACc2ogDUEFd2pB1oOL03xqIgJBBXdqQdaDi9N8aiINQR53Ig4gAkEedyIScyBFIABqIA8gFHMgAnNqIA1BBXdqQdaDi9N8aiIAc2ogQCAUaiASIA9zIA1zaiAAQQV3akHWg4vTfGoiAkEFd2pB1oOL03xqIg1BHnciD2ogQSAOaiACQR53IhQgAEEedyIAcyANc2ogRiASaiAAIA5zIAJzaiANQQV3akHWg4vTfGoiAkEFd2pB1oOL03xqIg1BHnciDiACQR53IhJzIEIgOHMgRHMgTHNBAXciFSAAaiAPIBRzIAJzaiANQQV3akHWg4vTfGoiAHNqIEcgFGogEiAPcyANc2ogAEEFd2pB1oOL03xqIgJBBXdqQdaDi9N8aiINQR53Ig9qIEggDmogAkEedyIUIABBHnciAHMgDXNqIEMgOXMgRXMgFXNBAXciGSASaiAAIA5zIAJzaiANQQV3akHWg4vTfGoiAkEFd2pB1oOL03xqIg1BHnciDiACQR53IhJzID8gQ3MgTHMgS3NBAXciGiAAaiAPIBRzIAJzaiANQQV3akHWg4vTfGoiAHNqIEQgOnMgRnMgGXNBAXciGyAUaiASIA9zIA1zaiAAQQV3akHWg4vTfGoiAkEFd2pB1oOL03xqIg1BHnciDyBOajYCkIkBQQAgTyBKIERzIBVzIBpzQQF3IhQgEmogAEEedyIAIA5zIAJzaiANQQV3akHWg4vTfGoiEkEedyIVajYCjIkBQQAgCSBFIDtzIEdzIBtzQQF3IA5qIAJBHnciAiAAcyANc2ogEkEFd2pB1oOL03xqIg1BHndqNgKIiQFBACBQIEAgSnMgS3MgSXNBAXcgAGogDyACcyASc2ogDUEFd2pB1oOL03xqIgBqNgKEiQFBACBNIEwgRXMgGXMgFHNBAXdqIAJqIBUgD3MgDXNqIABBBXdqQdaDi9N8ajYCgIkBCzoAQQBC/rnrxemOlZkQNwKIiQFBAEKBxpS6lvHq5m83AoCJAUEAQvDDy54MNwKQiQFBAEEANgKYiQELqAMBCH9BACECQQBBACgClIkBIgMgAUEDdGoiBDYClIkBQQBBACgCmIkBIAQgA0lqIAFBHXZqNgKYiQECQCADQQN2QT9xIgUgAWpBwABJDQBBwAAgBWsiAkEDcSEGQQAhAwJAIAVBP3NBA0kNACAFQYCJAWohByACQfwAcSEIQQAhAwNAIAcgA2oiBEEcaiAAIANqIgktAAA6AAAgBEEdaiAJQQFqLQAAOgAAIARBHmogCUECai0AADoAACAEQR9qIAlBA2otAAA6AAAgCCADQQRqIgNHDQALCwJAIAZFDQAgACADaiEEIAMgBWpBnIkBaiEDA0AgAyAELQAAOgAAIARBAWohBCADQQFqIQMgBkF/aiIGDQALC0GciQEQASAFQf8AcyEDQQAhBSADIAFPDQADQCAAIAJqEAEgAkH/AGohAyACQcAAaiIEIQIgAyABSQ0ACyAEIQILAkAgASACRg0AIAEgAmshCSAAIAJqIQIgBUGciQFqIQNBACEEA0AgAyACLQAAOgAAIAJBAWohAiADQQFqIQMgCSAEQQFqIgRB/wFxSw0ACwsLCQBBgAkgABADC6YDAQJ/IwBBEGsiACQAIABBgAE6AAcgAEEAKAKYiQEiAUEYdCABQYD+A3FBCHRyIAFBCHZBgP4DcSABQRh2cnI2AAggAEEAKAKUiQEiAUEYdCABQYD+A3FBCHRyIAFBCHZBgP4DcSABQRh2cnI2AAwgAEEHakEBEAMCQEEAKAKUiQFB+ANxQcADRg0AA0AgAEEAOgAHIABBB2pBARADQQAoApSJAUH4A3FBwANHDQALCyAAQQhqQQgQA0EAQQAoAoCJASIBQRh0IAFBgP4DcUEIdHIgAUEIdkGA/gNxIAFBGHZycjYCgAlBAEEAKAKEiQEiAUEYdCABQYD+A3FBCHRyIAFBCHZBgP4DcSABQRh2cnI2AoQJQQBBACgCiIkBIgFBGHQgAUGA/gNxQQh0ciABQQh2QYD+A3EgAUEYdnJyNgKICUEAQQAoAoyJASIBQRh0IAFBgP4DcUEIdHIgAUEIdkGA/gNxIAFBGHZycjYCjAlBAEEAKAKQiQEiAUEYdCABQYD+A3FBCHRyIAFBCHZBgP4DcSABQRh2cnI2ApAJIABBEGokAAsGAEGAiQELQwBBAEL+uevF6Y6VmRA3AoiJAUEAQoHGlLqW8ermbzcCgIkBQQBC8MPLngw3ApCJAUEAQQA2ApiJAUGACSAAEAMQBQsLCwEAQYAICwRcAAAA",
    hash: "6b530c24",
  };
  const f = new i();
  let H = null;
  (A.createSHA1 = function () {
    return s(F, 20).then((A) => {
      A.init();
      const I = {
        init: () => (A.init(), I),
        update: (i) => (A.update(i), I),
        digest: (I) => A.digest(I),
        save: () => A.save(),
        load: (i) => (A.load(i), I),
        blockSize: 64,
        digestSize: 20,
      };
      return I;
    });
  }),
    (A.sha1 = function (A) {
      if (null === H)
        return (function (A, i, g) {
          return I(this, void 0, void 0, function* () {
            const I = yield A.lock(),
              B = yield s(i, g);
            return I(), B;
          });
        })(f, F, 20).then((I) => ((H = I), H.calculate(A)));
      try {
        const I = H.calculate(A);
        return Promise.resolve(I);
      } catch (A) {
        return Promise.reject(A);
      }
    });
});
