import { useState, useEffect } from "react";

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
    cuerpo: "A partir del 7 de julio atenderemos lunes a viernes de 8:30 am a 3:30 pm. Los viernes únicamente con cita previa. WhatsApp: (470) 309-4360.",
  },
  {
    id: 3,
    titulo: "Requisitos para pasaporte – actualización junio 2026",
    fecha: "10 jun 2026",
    categoria: "Trámites",
    cuerpo: "Se acepta cédula digital como documento de identidad. Contáctenos vía WhatsApp al (470) 309-4360 para la lista completa de requisitos.",
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
  ];
  return (
    <header style={{ background: "#002D72", color: "#fff", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 14px rgba(0,0,0,0.3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(255,255,255,0.4)" }}>
          <img src="/icon-192.png" alt="Consulado General RD" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
function ExpedienteCard({ exp }) {
  const cfg = PASO_CONFIG[(exp.paso || 1) - 1] || PASO_CONFIG[0];
  const entregado = exp.paso === 5;

  return (
    <div style={{ ...S.card, marginBottom: 16, animation: "fadeUp 0.3s ease" }}>
      {/* Cabecera */}
      <div style={{ background: "#002D72", padding: "18px 22px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ background: exp.tipoBg, color: exp.tipoColor, borderRadius: 10, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
            {exp.tipoSolicitud}
          </span>
          {exp.esFedEx && (
            <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
              📦 FedEx
            </span>
          )}
          {!exp.esFedEx && exp.modoEntrega && (
            <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 10, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
              🏢 Retiro en sede
            </span>
          )}
        </div>
        <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.25 }}>{exp.nombre}</div>
      </div>

      <div style={{ padding: "18px 22px" }}>
        {/* Badge estado */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
          {exp.estadoLabel}
        </div>

        {/* Aviso expediente vinculado */}
        {exp.expedientePrincipal && (
          <div style={{ background: "#E8F5E9", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#2E7D32", marginBottom: 16, borderLeft: "3px solid #4CAF50" }}>
            📎 Su envío está coordinado junto al expediente de <strong>{exp.expedientePrincipal}</strong>
          </div>
        )}

        {/* Mensaje: Preparando envío FedEx (paso 4, aún no enviado) */}
        {exp.esPreparandoEnvio && (
          <div style={{ background: "#EDE7F6", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#4527A0", marginBottom: 16, borderLeft: "3px solid #7E57C2", lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>📦 Preparando envío vía FedEx</div>
            {exp.esEnvioConjunto && exp.expedientePrincipal ? (
              <>Su pasaporte se enviará junto al expediente de <strong>{exp.expedientePrincipal}</strong>. Recibirá el número de tracking cuando el paquete sea despachado.</>
            ) : (
              <>Su pasaporte está listo y será despachado próximamente. Recibirá el número de tracking cuando el paquete salga.</>
            )}
          </div>
        )}

        {/* Mensaje especial FedEx */}
        {entregado && exp.estadoRaw === "Enviado via FedEx" && (
          <div style={{ background: "#F3E5F5", borderRadius: 8, padding: "14px 16px", fontSize: 13, color: "#4A148C", marginBottom: 16, borderLeft: "3px solid #9C27B0" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>📦 Su pasaporte fue enviado vía FedEx</div>

            {exp.fedexTracking ? (
              <>
                <div style={{ marginBottom: 8 }}>
                  Número de tracking: <strong style={{ letterSpacing: 0.5 }}>{exp.fedexTracking}</strong>
                </div>
                <a
                  href={`https://www.fedex.com/fedextrack/?trknbr=${exp.fedexTracking}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-block", background: "#4A148C", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none", marginBottom: 12 }}
                >
                  Rastrear mi paquete en FedEx →
                </a>
                <div style={{ fontSize: 12, color: "#6A1B9A", lineHeight: 1.6 }}>
                  Le recomendamos estar atento/a al progreso de su paquete a través de este número.<br />
                  <strong>⚠️ Nota importante:</strong> FedEx es la empresa responsable de la entrega. Es importante que usted mismo/a le dé seguimiento al estado de su envío y, en caso necesario, coordine directamente con FedEx cualquier ajuste en la entrega (cambio de dirección, reprogramación, etc.).
                </div>
              </>
            ) : exp.esEnvioConjunto && exp.expedientePrincipal ? (
              <div style={{ fontSize: 13, color: "#6A1B9A", lineHeight: 1.6 }}>
                Su pasaporte fue enviado junto al expediente de <strong>{exp.expedientePrincipal}</strong>. El tracking del envío está asociado a ese expediente.<br />
                <strong>⚠️ Nota importante:</strong> FedEx es la empresa responsable de la entrega. Coordine directamente con FedEx cualquier ajuste en la entrega.
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "#6A1B9A", lineHeight: 1.6 }}>
                Su pasaporte está siendo preparado para envío. Pronto recibirá el número de tracking.<br />
                <strong>⚠️ Nota importante:</strong> FedEx es la empresa responsable de la entrega. Coordine directamente con FedEx cualquier ajuste en la entrega.
              </div>
            )}
          </div>
        )}

        {/* Fecha entrega si está entregado */}
        {entregado && exp.estadoRaw === "Entregado" && exp.fechaEntrega && (
          <div style={{ background: "#E8F5E9", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#1B5E20", marginBottom: 16 }}>
            ✅ Entregado el {exp.fechaEntrega}
          </div>
        )}

        {/* Pasos */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "#90A4AE", textTransform: "uppercase", letterSpacing: 0.9, marginBottom: 14 }}>Progreso</div>
        {PASOS.map((paso, i) => {
          const pasoNum = i + 1;
          const done = entregado ? true : pasoNum <= exp.paso;
          const active = !entregado && pasoNum === exp.paso;
          const stepCfg = PASO_CONFIG[i];
          return (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: done ? (active ? stepCfg.dot : "#002D72") : "#EEEEEE", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, border: active ? `3px solid ${stepCfg.color}` : "3px solid transparent", boxSizing: "border-box" }}>
                  {done && !active ? "✓" : active ? "●" : ""}
                </div>
                {i < PASOS.length - 1 && <div style={{ width: 2, height: 26, background: done && !active ? "#002D72" : "#EEEEEE", margin: "2px 0" }} />}
              </div>
              <div style={{ paddingTop: 3 }}>
                <div style={{ fontSize: 13, color: done ? "#263238" : "#BDBDBD", fontWeight: active ? 700 : done ? 500 : 400, marginBottom: 22, display: "flex", alignItems: "center", gap: 8 }}>
                  {paso}
                  {active && <span style={{ background: stepCfg.bg, color: stepCfg.color, borderRadius: 8, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>Actual</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExpedienteInvestigacion({ exp }) {
  return (
    <div style={{ ...S.card, marginBottom: 16, animation: "fadeUp 0.3s ease" }}>
      <div style={{ background: "#E65100", padding: "18px 22px", color: "#fff" }}>
        <span style={{ background: exp.tipoBg, color: exp.tipoColor, borderRadius: 10, padding: "3px 10px", fontSize: 11, fontWeight: 700, marginBottom: 8, display: "inline-block" }}>{exp.tipoSolicitud}</span>
        <div style={{ fontSize: 19, fontWeight: 800 }}>{exp.nombre}</div>
      </div>
      <div style={{ padding: "18px 22px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#FFF3E0", color: "#BF360C", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF9800", display: "inline-block" }} />
          Su expediente requiere atención
        </div>
        {exp.notaConsulado && (
          <div style={{ background: "#FFF8E1", borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#455A64", borderLeft: "3px solid #FF9800", lineHeight: 1.65, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#FF9800", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Mensaje del Consulado</div>
            {exp.notaConsulado}
          </div>
        )}
        <div style={{ padding: "12px 14px", background: "#F5F7FA", borderRadius: 8, fontSize: 13, color: "#546E7A" }}>
          Contáctenos: <strong>WhatsApp (470) 309-4360</strong> · <strong>consuldomatl@gmail.com</strong>
        </div>
      </div>
    </div>
  );
}

function ExpedienteIncompleto({ exp }) {
  return (
    <div style={{ ...S.card, marginBottom: 16, animation: "fadeUp 0.3s ease" }}>
      <div style={{ background: "#BF360C", padding: "18px 22px", color: "#fff" }}>
        <span style={{ background: exp.tipoBg, color: exp.tipoColor, borderRadius: 10, padding: "3px 10px", fontSize: 11, fontWeight: 700, marginBottom: 8, display: "inline-block" }}>{exp.tipoSolicitud}</span>
        <div style={{ fontSize: 19, fontWeight: 800 }}>{exp.nombre}</div>
      </div>
      <div style={{ padding: "18px 22px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#FFEBEE", color: "#B71C1C", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF5350", display: "inline-block" }} />
          Documentos incompletos
        </div>
        {exp.notaConsulado ? (
          <div style={{ background: "#FFF3E0", borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#455A64", borderLeft: "3px solid #EF5350", lineHeight: 1.65, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#B71C1C", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Documentos faltantes</div>
            {exp.notaConsulado}
          </div>
        ) : (
          <div style={{ background: "#FFF3E0", borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#455A64", borderLeft: "3px solid #EF5350", lineHeight: 1.65, marginBottom: 14 }}>
            Comuníquese con el Consulado para conocer los documentos faltantes.
          </div>
        )}
        <div style={{ padding: "12px 14px", background: "#F5F7FA", borderRadius: 8, fontSize: 13, color: "#546E7A" }}>
          Contáctenos: <strong>WhatsApp (470) 309-4360</strong> · <strong>consuldomatl@gmail.com</strong>
        </div>
      </div>
    </div>
  );
}

function ExpedientePendientePago({ exp }) {
  return (
    <div style={{ ...S.card, marginBottom: 16, animation: "fadeUp 0.3s ease" }}>
      <div style={{ background: "#E65100", padding: "18px 22px", color: "#fff" }}>
        <span style={{ background: exp.tipoBg, color: exp.tipoColor, borderRadius: 10, padding: "3px 10px", fontSize: 11, fontWeight: 700, marginBottom: 8, display: "inline-block" }}>{exp.tipoSolicitud}</span>
        <div style={{ fontSize: 19, fontWeight: 800 }}>{exp.nombre}</div>
      </div>
      <div style={{ padding: "18px 22px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#FFF3E0", color: "#E65100", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF9800", display: "inline-block" }} />
          Pendiente de pago
        </div>
        {exp.notaConsulado ? (
          <div style={{ background: "#FFF8E1", borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#455A64", borderLeft: "3px solid #FF9800", lineHeight: 1.65, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E65100", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Información de pago</div>
            {exp.notaConsulado}
          </div>
        ) : (
          <div style={{ background: "#FFF8E1", borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#455A64", borderLeft: "3px solid #FF9800", lineHeight: 1.65, marginBottom: 14 }}>
            Comuníquese con el Consulado para conocer los detalles del pago pendiente.
          </div>
        )}
        <div style={{ padding: "12px 14px", background: "#F5F7FA", borderRadius: 8, fontSize: 13, color: "#546E7A" }}>
          Contáctenos: <strong>WhatsApp (470) 309-4360</strong> · <strong>consuldomatl@gmail.com</strong>
        </div>
      </div>
    </div>
  );
}

function ExpedienteAnulado({ exp }) {
  return (
    <div style={{ ...S.card, marginBottom: 16, animation: "fadeUp 0.3s ease" }}>
      <div style={{ background: "#37474F", padding: "18px 22px", color: "#fff" }}>
        <div style={{ fontSize: 19, fontWeight: 800 }}>{exp.nombre}</div>
      </div>
      <div style={{ padding: "18px 22px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#ECEFF1", color: "#546E7A", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#90A4AE", display: "inline-block" }} />
          Expediente anulado
        </div>
        <div style={{ fontSize: 13, color: "#546E7A", lineHeight: 1.6 }}>
          Comuníquese con el Consulado: <strong>(470) 309-4360</strong> · <strong>consuldomatl@gmail.com</strong>
        </div>
      </div>
    </div>
  );
}

function PasaporteView() {
  const [cedula, setCedula]   = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [buscado, setBuscado] = useState(false);

  async function consultar() {
    if (!cedula.trim()) return;
    setLoading(true); setError(""); setResult(null); setBuscado(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/pasaporte/${encodeURIComponent(cedula.trim())}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "No se pudo consultar. Intente nuevamente.");
      else setResult(data);
    } catch {
      setError("No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 18px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🛂</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#002D72", margin: "0 0 7px" }}>Estado de su pasaporte</h1>
        <p style={{ color: "#546E7A", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Ingrese su número de cédula dominicana para consultar el estado de su expediente.
        </p>
      </div>

      <div style={{ ...S.card, padding: 22, marginBottom: 18 }}>
        <label style={S.label}>Número de cédula dominicana</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={cedula} onChange={e => setCedula(e.target.value)}
            onKeyDown={e => e.key === "Enter" && consultar()}
            placeholder="Ej: 402-0550231-2"
            style={{ ...S.input, flex: 1 }}
            onFocus={e => e.target.style.borderColor = "#002D72"}
            onBlur={e => e.target.style.borderColor = "#CFD8DC"}
          />
          <button onClick={consultar} disabled={loading || !cedula.trim()}
            style={{ background: (loading || !cedula.trim()) ? "#B0BEC5" : "#002D72", color: "#fff", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: (loading || !cedula.trim()) ? "default" : "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {loading ? "Buscando…" : "Consultar"}
          </button>
        </div>
        <p style={{ fontSize: 11, color: "#B0BEC5", margin: "8px 0 0" }}>
          Puede escribir con o sin guiones — el sistema los reconoce igual.
        </p>
      </div>

      {error && (
        <div style={{ background: "#FFF3E0", border: "1px solid #FFCC80", borderRadius: 10, padding: "14px 18px", color: "#BF360C", fontSize: 14, marginBottom: 18, lineHeight: 1.5 }}>
          ⚠ {error}
        </div>
      )}

      {result && result.multiples && (
        <div style={{ background: "#E3F2FD", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#1565C0", marginBottom: 16, fontWeight: 600 }}>
          Encontramos {result.expedientes.length} expedientes asociados a su cédula:
        </div>
      )}

      {result && result.expedientes && result.expedientes.map(exp => {
        if (exp.esInvestigacion) return <ExpedienteInvestigacion key={exp.id} exp={exp} />;
        if (exp.esIncompleto) return <ExpedienteIncompleto key={exp.id} exp={exp} />;
        if (exp.esPendientePago) return <ExpedientePendientePago key={exp.id} exp={exp} />;
        if (exp.esAnulado) return <ExpedienteAnulado key={exp.id} exp={exp} />;
        return <ExpedienteCard key={exp.id} exp={exp} />;
      })}

      {!buscado && (
        <div style={{ textAlign: "center", padding: "44px 0", color: "#CFD8DC" }}>
          <div style={{ fontSize: 13, color: "#B0BEC5" }}>Ingrese su cédula para consultar el estado de su pasaporte.</div>
        </div>
      )}
    </div>
  );
}

// ─── NOTICIAS ────────────────────────────────────────────────────────────────
function NoticiasView() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [sel, setSel]           = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/noticias`)
      .then(r => r.json())
      .then(data => { setNoticias(data.noticias || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
        <div style={{ padding: "24px 26px", fontSize: 15, color: "#37474F", lineHeight: 1.75 }}>{sel.contenido}</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "32px 18px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#002D72", margin: "0 0 5px" }}>Noticias y avisos</h1>
      <p style={{ color: "#546E7A", fontSize: 14, margin: "0 0 22px" }}>Información oficial del Consulado General de la República Dominicana en Atlanta.</p>

      {loading && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#90A4AE" }}>
          <div style={{ fontSize: 13 }}>Cargando noticias…</div>
        </div>
      )}

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
            <p style={{ fontSize: 13, color: "#546E7A", margin: 0, lineHeight: 1.5 }}>{(n.contenido || "").slice(0, 110)}…</p>
          </div>
        ))}
        {!loading && noticias.length === 0 && (
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
          onKeyDown={e => { if (e.key === "Enter") { if (pin === "281305") { setAuth(true); setPinErr(false); } else setPinErr(true); } }}
          style={{ ...S.input, textAlign: "center", letterSpacing: 8, border: `1.5px solid ${pinErr ? "#CE1126" : "#CFD8DC"}`, marginBottom: 8 }} />
        {pinErr && <div style={{ color: "#CE1126", fontSize: 12, marginBottom: 8 }}>PIN incorrecto</div>}
        <button onClick={() => { if (pin === "281305") { setAuth(true); setPinErr(false); } else setPinErr(true); }}
          style={{ width: "100%", background: "#002D72", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Entrar
        </button>
        <p style={{ fontSize: 11, color: "#CFD8DC", margin: "14px 0 0" }}>Acceso restringido al personal autorizado.</p>
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
  const isAdmin = window.location.hash === "#/admin";
  const [view, setView]         = useState("pasaporte");
  

  if (isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#F0F4F8", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
        <style>{`* { box-sizing: border-box; } input, textarea, select, button { font-family: inherit; }`}</style>
        <header style={{ background: "#002D72", color: "#fff", padding: "0 20px", display: "flex", alignItems: "center", height: 62, boxShadow: "0 2px 14px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Consulado General RD · Panel Interno</div>
        </header>
        <AdminView noticias={noticias} setNoticias={setNoticias} />
      </div>
    );
  }

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
        {view === "noticias"  && <NoticiasView />}
      </main>
      <footer style={{ textAlign: "center", padding: "28px 20px 40px", color: "#90A4AE", fontSize: 12, borderTop: "1px solid #E0E7EF", marginTop: 48, lineHeight: 2.2 }}>
        <strong style={{ color: "#546E7A" }}>Consulado General de la República Dominicana en Atlanta</strong><br />
        <a href="https://wa.me/14703094360" target="_blank" rel="noreferrer" style={{ color: "#90A4AE", textDecoration: "none" }}>💬 (470) 309-4360</a>
        {" · "}
        <a href="mailto:consuldomatl@gmail.com" style={{ color: "#90A4AE", textDecoration: "none" }}>✉ consuldomatl@gmail.com</a>
        <br />
        📷 @RDenAtlanta · ▶ @RDenAtlanta
      </footer>
    </div>
  );
}
