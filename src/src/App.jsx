import { useState } from "react";

// ─── CONFIGURACIÓN ───────────────────────────────────────────────────────────
// Cuando el backend esté en Railway, reemplazar esta URL con la URL real
const BACKEND_URL = "https://consulado-backend-production.up.railway.app";

const PASOS = [
  "Solicitud recibida",
  "En procesamiento",
  "En producción",
  "Listo para entrega",
  "Entregado",
];

const PASO_CONFIG = [
  { color: "#546E7A", bg: "#ECEFF1", dot: "#90A4AE" },
  { color: "#1565C0", bg: "#E3F2FD", dot: "#42A5F5" },
  { color: "#4A148C", bg: "#F3E5F5", dot: "#9C27B0" },
  { color: "#E65100", bg: "#FFF3E0", dot: "#FF9800" },
  { color: "#1B5E20", bg: "#E8F5E9", dot: "#4CAF50" },
];

// ─── NOTICIAS INICIALES ──────────────────────────────────────────────────────
const NOTICIAS_INIT = [
  {
    id: 1,
    titulo: "Apertura oficial del Consulado General en Atlanta",
    fecha: "20 jun 2026",
    categoria: "Institucional",
    cuerpo: "Con orgullo anunciamos la apertura oficial de nuestra sede consular en Atlanta, Georgia, bajo la dirección de la Cónsul General Rosa Yanina Torres Tamares. Atendemos Georgia, Alabama, Tennessee, Mississippi y Louisiana.",
  },
  {
    id: 2,
    titulo: "Nuevos horarios de atención – julio 2026",
    fecha: "27 jun 2026",
    categoria: "Aviso",
    cuerpo: "A partir del 7 de julio atenderemos lunes a viernes de 8:30 am a 3:30 pm. Los viernes únicamente con cita previa. Tel: (678) 427-0654.",
  },
  {
    id: 3,
    titulo: "Requisitos para pasaporte – actualización junio 2026",
    fecha: "10 jun 2026",
    categoria: "Trámites",
    cuerpo: "Se acepta cédula digital como documento de identidad. Llame al (678) 427-0654 o visítenos para la lista completa de requisitos.",
  },
];

const CAT_COLOR = { Aviso: "#1565C0", Institucional: "#5E35B1", Trámites: "#00695C" };

// ─── ESTILOS BASE ─────────────────────────────────────────────────────────────
const S = {
  card: { background: "#fff", borderRadius: 14, boxShadow: "0 2px 16px rgba(0,45,114,0.10)", overflow: "hidden" },
  input: { width: "100%", boxSizing: "border-box", border: "1.5px solid #CFD8DC", borderRadius: 8, padding: "11px 14px", fontSize: 15, color: "#263238", fontFamily: "inherit", background: "#fff", outline: "none" },
  label: { fontSize: 11, fontWeight: 700, color: "#546E7A", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.6 },
};

// ─── HEADER ──────────────────────────────────────────────────────────────────
function Header({ view, setView }) {
  const tabs = [
    { key: "pasaporte", label: "Mi Pasaporte" },
    { key: "noticias",  label: "Noticias" },
    { key: "admin",     label: "⚙" },
  ];
  return (
    <header style={{ background: "#002D72", color: "#fff", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 14px rgba(0,0,0,0.3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.35)", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", flexShrink: 0 }}>
          <div style={{ background: "#002D72" }} /><div style={{ background: "#CE1126" }} />
          <div style={{ background: "#CE1126" }} /><div style={{ background: "#002D72" }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.2, lineHeight: 1.2 }}>Consulado General RD</div>
          <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0.8, textTransform: "uppercase" }}>Atlanta, Georgia</div>
        </div>
      </div>
      <nav style={{ display: "flex", gap: 3 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} style={{ background: view === t.key ? "rgba(255,255,255,0.18)" : "transparent", border: "none", color: "#fff", padding: "7px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: view === t.key ? 700 : 400, fontFamily: "inherit" }}>
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

// ─── VISTA PASAPORTE ──────────────────────────────────────────────────────────
function PasaporteView() {
  const [cedula, setCedula] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [buscado, setBuscado] = useState(false);

  async function consultar() {
    if (!cedula.trim()) return;
    setLoading(true); setError(""); setResult(null); setBuscado(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/pasaporte/${encodeURIComponent(cedula.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo consultar. Intente nuevamente.");
      } else {
        setResult(data);
      }
    } catch {
      setError("No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.");
    }
    setLoading(false);
  }

  const cfg = result ? PASO_CONFIG[(result.paso || 1) - 1] || PASO_CONFIG[0] : null;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 18px" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🛂</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#002D72", margin: "0 0 7px" }}>Estado de su pasaporte</h1>
        <p style={{ color: "#546E7A", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Ingrese su número de cédula dominicana para consultar el estado de su expediente.
        </p>
      </div>

      {/* Buscador */}
      <div style={{ ...S.card, padding: 22, marginBottom: 18 }}>
        <label style={S.label}>Número de cédula dominicana</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={cedula}
            onChange={e => setCedula(e.target.value)}
            onKeyDown={e => e.key === "Enter" && consultar()}
            placeholder="Ej: 402-0550231-2"
            style={{ ...S.input, flex: 1 }}
            onFocus={e => e.target.style.borderColor = "#002D72"}
            onBlur={e => e.target.style.borderColor = "#CFD8DC"}
          />
          <button
            onClick={consultar}
            disabled={loading || !cedula.trim()}
            style={{ background: (loading || !cedula.trim()) ? "#B0BEC5" : "#002D72", color: "#fff", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: (loading || !cedula.trim()) ? "default" : "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}
          >
            {loading ? "Buscando…" : "Consultar"}
          </button>
        </div>
        <p style={{ fontSize: 11, color: "#B0BEC5", margin: "8px 0 0" }}>
          Puede escribir con o sin guiones — el sistema los reconoce igual.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#FFF3E0", border: "1px solid #FFCC80", borderRadius: 10, padding: "14px 18px", color: "#BF360C", fontSize: 14, marginBottom: 18, lineHeight: 1.5 }}>
          ⚠ {error}
        </div>
      )}

      {/* Resultado normal */}
      {result && !result.esInvestigacion && !result.esAnulado && (
        <div style={{ ...S.card, animation: "fadeUp 0.3s ease" }}>
          {/* Cabecera */}
          <div style={{ background: "#002D72", padding: "20px 24px", color: "#fff" }}>
            {result.noExp && (
              <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.14)", borderRadius: 10, padding: "3px 10px", fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.3 }}>
                Expediente {result.noExp}{result.tipo ? ` · ${result.tipo}` : ""}
              </div>
            )}
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.25 }}>{result.nombre}</div>
          </div>

          <div style={{ padding: "22px 24px" }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "7px 16px", fontSize: 14, fontWeight: 700, marginBottom: 26 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
              {result.estadoLabel}
            </div>

            {/* Pasos */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#90A4AE", textTransform: "uppercase", letterSpacing: 0.9, marginBottom: 16 }}>Progreso del expediente</div>
              {PASOS.map((paso, i) => {
                const pasoNum = i + 1;
                const done = pasoNum <= result.paso;
                const active = pasoNum === result.paso;
                const stepCfg = PASO_CONFIG[i];
                return (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? (active ? stepCfg.dot : "#002D72") : "#EEEEEE", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, border: active ? `3px solid ${stepCfg.color}` : "3px solid transparent", boxSizing: "border-box", transition: "all 0.2s" }}>
                        {done && !active ? "✓" : active ? "●" : ""}
                      </div>
                      {i < PASOS.length - 1 && (
                        <div style={{ width: 2, height: 30, background: done && !active ? "#002D72" : "#EEEEEE", margin: "2px 0", transition: "background 0.2s" }} />
                      )}
                    </div>
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ fontSize: 14, color: done ? "#263238" : "#BDBDBD", fontWeight: active ? 700 : done ? 500 : 400, marginBottom: 28, display: "flex", alignItems: "center", gap: 8 }}>
                        {paso}
                        {active && (
                          <span style={{ background: stepCfg.bg, color: stepCfg.color, borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>Actual</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Resultado — Investigación */}
      {result && result.esInvestigacion && (
        <div style={{ ...S.card, animation: "fadeUp 0.3s ease" }}>
          <div style={{ background: "#E65100", padding: "20px 24px", color: "#fff" }}>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.25 }}>{result.nombre}</div>
            {result.noExp && <div style={{ fontSize: 12, opacity: 0.75, marginTop: 3 }}>Expediente {result.noExp}</div>}
          </div>
          <div style={{ padding: "22px 24px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#FFF3E0", color: "#BF360C", borderRadius: 20, padding: "7px 16px", fontSize: 14, fontWeight: 700, marginBottom: 18 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF9800", display: "inline-block" }} />
              Su expediente requiere atención
            </div>
            {result.notaConsulado && (
              <div style={{ background: "#FFF8E1", borderRadius: 10, padding: "14px 18px", fontSize: 14, color: "#455A64", borderLeft: "3px solid #FF9800", lineHeight: 1.65 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#FF9800", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Mensaje del Consulado</div>
                {result.notaConsulado}
              </div>
            )}
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#F5F7FA", borderRadius: 8, fontSize: 13, color: "#546E7A" }}>
              Para más información comuníquese al <strong>(678) 427-0654</strong> o escriba a <strong>misantana@mirex.gob.do</strong>
            </div>
          </div>
        </div>
      )}

      {/* Resultado — Anulado */}
      {result && result.esAnulado && (
        <div style={{ ...S.card, animation: "fadeUp 0.3s ease" }}>
          <div style={{ background: "#37474F", padding: "20px 24px", color: "#fff" }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{result.nombre}</div>
            {result.noExp && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 3 }}>Expediente {result.noExp}</div>}
          </div>
          <div style={{ padding: "22px 24px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#ECEFF1", color: "#546E7A", borderRadius: 20, padding: "7px 16px", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#90A4AE", display: "inline-block" }} />
              Expediente anulado
            </div>
            <div style={{ fontSize: 14, color: "#546E7A", lineHeight: 1.6 }}>
              Por favor comuníquese con el Consulado para más información:<br />
              <strong>(678) 427-0654</strong> · <strong>misantana@mirex.gob.do</strong>
            </div>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!buscado && (
        <div style={{ textAlign: "center", padding: "44px 0", color: "#CFD8DC" }}>
          <div style={{ fontSize: 13, color: "#B0BEC5" }}>Ingrese su cédula para consultar el estado de su pasaporte.</div>
        </div>
      )}
    </div>
  );
}

// ─── NOTICIAS ────────────────────────────────────────────────────────────────
function NoticiasView({ noticias }) {
  const [sel, setSel] = useState(null);

  if (sel) return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "28px 18px" }}>
      <button onClick={() => setSel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#002D72", fontSize: 13, fontWeight: 700, padding: "0 0 18px", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
        ← Volver a noticias
      </button>
      <div style={S.card}>
        <div style={{ background: "#002D72", padding: "24px 26px", color: "#fff" }}>
          <span style={{ background: CAT_COLOR[sel.categoria] || "#546E7A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{sel.categoria}</span>
          <h2 style={{ fontSize: 21, fontWeight: 800, margin: "10px 0 5px", lineHeight: 1.25 }}>{sel.titulo}</h2>
          <div style={{ fontSize: 12, opacity: 0.6 }}>{sel.fecha}</div>
        </div>
        <div style={{ padding: "24px 26px", fontSize: 15, color: "#37474F", lineHeight: 1.75 }}>{sel.cuerpo}</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "32px 18px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#002D72", margin: "0 0 5px" }}>Noticias y avisos</h1>
      <p style={{ color: "#546E7A", fontSize: 14, margin: "0 0 22px" }}>Información oficial del Consulado General en Atlanta.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {noticias.map(n => (
          <div key={n.id} onClick={() => setSel(n)}
            style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 8px rgba(0,45,114,0.08)", padding: "16px 20px", cursor: "pointer", borderLeft: `4px solid ${CAT_COLOR[n.categoria] || "#90A4AE"}`, transition: "box-shadow 0.15s, transform 0.12s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,45,114,0.14)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,45,114,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: CAT_COLOR[n.categoria], textTransform: "uppercase", letterSpacing: 0.5 }}>{n.categoria}</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#263238", margin: "4px 0 4px", lineHeight: 1.3 }}>{n.titulo}</div>
            <div style={{ fontSize: 11, color: "#90A4AE", marginBottom: 8 }}>{n.fecha}</div>
            <p style={{ fontSize: 13, color: "#546E7A", margin: 0, lineHeight: 1.5 }}>{n.cuerpo.slice(0, 110)}…</p>
          </div>
        ))}
        {noticias.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#90A4AE" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 13 }}>No hay publicaciones aún.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PANEL ADMIN ─────────────────────────────────────────────────────────────
function AdminView({ noticias, setNoticias }) {
  const [auth, setAuth] = useState(false);
  const [pin, setPin]   = useState("");
  const [pinErr, setPinErr] = useState(false);
  const [form, setForm] = useState({ titulo: "", categoria: "Aviso", cuerpo: "" });
  const [ok, setOk]     = useState(false);

  if (!auth) return (
    <div style={{ maxWidth: 340, margin: "80px auto", padding: "0 18px" }}>
      <div style={{ ...S.card, padding: "32px 26px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 14 }}>🔒</div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#002D72", margin: "0 0 5px" }}>Panel interno</h2>
        <p style={{ fontSize: 13, color: "#90A4AE", margin: "0 0 22px" }}>Solo para personal del Consulado</p>
        <input type="password" placeholder="PIN de acceso" value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { if (pin === "1844") { setAuth(true); setPinErr(false); } else setPinErr(true); } }}
          style={{ ...S.input, textAlign: "center", letterSpacing: 8, border: `1.5px solid ${pinErr ? "#CE1126" : "#CFD8DC"}`, marginBottom: 8 }} />
        {pinErr && <div style={{ color: "#CE1126", fontSize: 12, marginBottom: 8 }}>PIN incorrecto</div>}
        <button onClick={() => { if (pin === "1844") { setAuth(true); setPinErr(false); } else setPinErr(true); }}
          style={{ width: "100%", background: "#002D72", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Entrar
        </button>
        <p style={{ fontSize: 11, color: "#CFD8DC", margin: "14px 0 0" }}>Pista: año de la independencia dominicana</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "30px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#002D72", margin: 0 }}>Panel de administración</h1>
        <button onClick={() => setAuth(false)} style={{ background: "none", border: "1px solid #CFD8DC", color: "#546E7A", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Cerrar sesión</button>
      </div>

      {/* Formulario publicar */}
      <div style={{ ...S.card, padding: 22, marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#263238", margin: "0 0 16px" }}>Publicar aviso o noticia</h2>

        <label style={S.label}>Título</label>
        <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })}
          placeholder="Ej: Cierre por día feriado" style={{ ...S.input, marginBottom: 14 }} />

        <label style={S.label}>Categoría</label>
        <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}
          style={{ ...S.input, marginBottom: 14, cursor: "pointer" }}>
          <option>Aviso</option>
          <option>Institucional</option>
          <option>Trámites</option>
        </select>

        <label style={S.label}>Contenido</label>
        <textarea value={form.cuerpo} onChange={e => setForm({ ...form, cuerpo: e.target.value })}
          rows={4} placeholder="Escriba el contenido del aviso aquí…"
          style={{ ...S.input, resize: "vertical", lineHeight: 1.6, marginBottom: 16 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => {
              if (!form.titulo.trim() || !form.cuerpo.trim()) return;
              const fecha = new Date().toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric" });
              setNoticias([{ id: Date.now(), ...form, fecha }, ...noticias]);
              setForm({ titulo: "", categoria: "Aviso", cuerpo: "" });
              setOk(true); setTimeout(() => setOk(false), 3000);
            }}
            style={{ background: (form.titulo.trim() && form.cuerpo.trim()) ? "#002D72" : "#B0BEC5", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: (form.titulo.trim() && form.cuerpo.trim()) ? "pointer" : "default", fontFamily: "inherit" }}
          >
            Publicar
          </button>
          {ok && <span style={{ color: "#2E7D32", fontSize: 13, fontWeight: 700 }}>✓ Publicado exitosamente</span>}
        </div>
      </div>

      {/* Lista de publicaciones */}
      <div style={{ fontSize: 12, fontWeight: 700, color: "#90A4AE", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 12 }}>
        Publicaciones activas ({noticias.length})
      </div>
      {noticias.map(n => (
        <div key={n.id} style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px rgba(0,45,114,0.07)", padding: "13px 16px", marginBottom: 9, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, borderLeft: `4px solid ${CAT_COLOR[n.categoria] || "#90A4AE"}` }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#263238" }}>{n.titulo}</div>
            <div style={{ fontSize: 11, color: "#90A4AE" }}>{n.categoria} · {n.fecha}</div>
          </div>
          <button onClick={() => setNoticias(noticias.filter(x => x.id !== n.id))}
            style={{ background: "#FFF3E0", border: "none", color: "#BF360C", borderRadius: 6, padding: "5px 11px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", whiteSpace: "nowrap" }}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]       = useState("pasaporte");
  const [noticias, setNoticias] = useState(NOTICIAS_INIT);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F8", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        input, textarea, select, button { font-family: inherit; }
      `}</style>
      <Header view={view} setView={setView} />
      <main>
        {view === "pasaporte" && <PasaporteView />}
        {view === "noticias"  && <NoticiasView noticias={noticias} />}
        {view === "admin"     && <AdminView noticias={noticias} setNoticias={setNoticias} />}
      </main>
      <footer style={{ textAlign: "center", padding: "28px 20px 40px", color: "#90A4AE", fontSize: 12, borderTop: "1px solid #E0E7EF", marginTop: 48, lineHeight: 2 }}>
        <strong style={{ color: "#546E7A" }}>Consulado General de la República Dominicana en Atlanta</strong><br />
        📞 (678) 427-0654 · ✉ misantana@mirex.gob.do<br />
        Lunes a viernes · 9:00 am – 3:00 pm
      </footer>
    </div>
  );
}
