/* ============================================
   NutriPlan - Exports (Fase 4.1 y 4.2)
   - Lista de compras: CSV, Google Keep, Jumbo/Líder copy
   - Plan semanal: .ics (iCalendar) para Google Calendar / Apple / Outlook
   ============================================ */

(function cargarExports() {

  // ─────────────────────────────────────────────
  // Helpers de descarga
  // ─────────────────────────────────────────────
  function descargarArchivo(contenido, nombreArchivo, tipoMime) {
    const blob = new Blob([contenido], { type: tipoMime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function escaparCSV(valor) {
    if (valor == null) return '';
    const str = String(valor);
    if (/[",\n;]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
    return str;
  }

  // ─────────────────────────────────────────────
  // 4.1.A: CSV de lista de compras
  // ─────────────────────────────────────────────
  function exportarListaCSV(ingredientes, opciones) {
    opciones = opciones || {};
    const incluirCategoria = opciones.incluirCategoria !== false;
    const incluirPrecio = opciones.incluirPrecio !== false;

    const headers = ['Ingrediente', 'Cantidad', 'Unidad'];
    if (incluirCategoria) headers.push('Categoría');
    if (incluirPrecio) headers.push('Precio estimado CLP', 'Descripción compra');

    const filas = [headers.map(escaparCSV).join(',')];
    let totalCLP = 0;

    ingredientes.forEach(ing => {
      const cantidad = ing.cantidad != null ? Math.round(ing.cantidad * 10) / 10 : '';
      const unidad = ing.unidad || '';
      const precio = ing.precio_clp != null ? Math.round(ing.precio_clp) : '';
      if (typeof precio === 'number') totalCLP += precio;
      const fila = [
        escaparCSV(ing.nombre || ing.nombre_display),
        escaparCSV(cantidad),
        escaparCSV(unidad)
      ];
      if (incluirCategoria) fila.push(escaparCSV(ing.categoria || ''));
      if (incluirPrecio) {
        fila.push(escaparCSV(precio));
        fila.push(escaparCSV(ing.descripcion_compra || ''));
      }
      filas.push(fila.join(','));
    });

    // Fila de total
    if (incluirPrecio && totalCLP > 0) {
      const filaTotal = ['TOTAL ESTIMADO', '', '', ''];
      if (incluirCategoria) filaTotal.push('');
      filaTotal.push(totalCLP, '');
      filas.push(filaTotal.map(escaparCSV).join(','));
    }

    // UTF-8 BOM para compatibilidad con Excel en Windows
    const contenido = '\uFEFF' + filas.join('\n');
    const fecha = new Date().toISOString().split('T')[0];
    descargarArchivo(contenido, `nutriplan-lista-${fecha}.csv`, 'text/csv');
    return { total_items: ingredientes.length, total_clp: totalCLP };
  }

  // ─────────────────────────────────────────────
  // 4.1.B: Texto compacto para pegar en Jumbo/Líder online
  // Solo ingredientes, uno por línea, con cantidad y unidad de compra
  // ─────────────────────────────────────────────
  function generarTextoSupermercado(ingredientes) {
    const lineas = [];
    ingredientes.forEach(ing => {
      // Usar descripcion_compra si existe (p.ej. "Paquete de 1 kg"), si no cantidad + unidad
      if (ing.descripcion_compra) {
        lineas.push(`${ing.nombre} - ${ing.descripcion_compra}`);
      } else {
        const cant = ing.cantidad != null ? Math.round(ing.cantidad * 10) / 10 : '';
        lineas.push(`${ing.nombre} ${cant}${ing.unidad || ''}`);
      }
    });
    return lineas.join('\n');
  }

  // ─────────────────────────────────────────────
  // 4.1.C: Formato Google Keep (una checklist)
  // ─────────────────────────────────────────────
  function generarTextoKeep(ingredientes) {
    return ingredientes.map(ing => {
      const cant = ing.cantidad != null ? Math.round(ing.cantidad * 10) / 10 : '';
      const precio = ing.precio_clp ? ` (~$${Math.round(ing.precio_clp).toLocaleString('es-CL')})` : '';
      return `☐ ${ing.nombre} - ${cant}${ing.unidad || ''}${precio}`;
    }).join('\n');
  }

  // ─────────────────────────────────────────────
  // 4.2: Export plan semanal a .ics (iCalendar)
  // Formato compacto: 1 evento por día con todas las comidas en descripción
  // ─────────────────────────────────────────────

  const DIAS_MAP = {
    'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Miercoles': 3,
    'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Sabado': 6, 'Domingo': 0
  };

  const TIPOS_COMIDA = [
    { key: 'desayuno', label: 'Desayuno', icon: '🌅' },
    { key: 'snack_am', label: 'Snack AM', icon: '🍎' },
    { key: 'almuerzo', label: 'Almuerzo', icon: '🍽️' },
    { key: 'snack_pm', label: 'Snack PM', icon: '🍪' },
    { key: 'cena', label: 'Cena', icon: '🌙' }
  ];

  // Obtener próximo lunes a partir de hoy para anclar la semana 1
  function proximoLunes() {
    const hoy = new Date();
    const dow = hoy.getDay(); // 0=Dom, 1=Lun
    const diff = dow === 0 ? 1 : (dow === 1 ? 0 : 8 - dow);
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diff);
    lunes.setHours(0, 0, 0, 0);
    return lunes;
  }

  function formatearFechaICS(fecha) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    const hh = String(fecha.getHours()).padStart(2, '0');
    const mm = String(fecha.getMinutes()).padStart(2, '0');
    return `${y}${m}${d}T${hh}${mm}00`;
  }

  function escaparICS(texto) {
    if (!texto) return '';
    return String(texto)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  function generarICSCompacto(planSemanal, opciones) {
    opciones = opciones || {};
    const horaEvento = opciones.hora || 8; // 8:00 AM por defecto
    const lunesBase = proximoLunes();

    const lineas = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NutriPlan//Plan Semanal//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:NutriPlan - Plan Semanal`,
      'X-WR-TIMEZONE:America/Santiago'
    ];

    // Normalizar plan (soporta multi-semana)
    const semanas = [];
    if (planSemanal._numSemanas) {
      for (let i = 1; i <= planSemanal._numSemanas; i++) {
        if (planSemanal['semana_' + i]) semanas.push(planSemanal['semana_' + i]);
      }
    } else {
      semanas.push(planSemanal);
    }

    const DIAS_ORDEN = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    semanas.forEach((semanaObj, idxSemana) => {
      DIAS_ORDEN.forEach((dia, idxDia) => {
        const comidasDia = semanaObj[dia];
        if (!comidasDia || typeof comidasDia !== 'object') return;

        // Fecha: lunes base + idxSemana*7 + idxDia
        const fechaEvento = new Date(lunesBase);
        fechaEvento.setDate(lunesBase.getDate() + idxSemana * 7 + idxDia);
        fechaEvento.setHours(horaEvento, 0, 0, 0);

        const fechaFin = new Date(fechaEvento);
        fechaFin.setMinutes(fechaFin.getMinutes() + 30);

        // Construir descripción con todas las comidas
        let descripcion = `🍽️ Plan NutriPlan - ${dia}${semanas.length > 1 ? ' (Semana ' + (idxSemana + 1) + ')' : ''}\\n\\n`;
        let totalKcal = 0;
        let sumario = [];

        TIPOS_COMIDA.forEach(tc => {
          const comida = comidasDia[tc.key];
          if (!comida || !comida.nombre) return;
          const kcal = comida.calorias_escaladas || comida.calorias_base || 0;
          totalKcal += kcal;
          descripcion += `${tc.icon} ${tc.label}: ${comida.nombre} (${kcal} kcal)\\n`;
          if (tc.key === 'almuerzo' || tc.key === 'cena') {
            sumario.push(comida.nombre);
          }
        });

        descripcion += `\\n🔥 Total: ${totalKcal} kcal`;
        if (comidasDia._costo_clp) {
          descripcion += ` | 💰 $${Math.round(comidasDia._costo_clp).toLocaleString('es-CL')}`;
        }

        const titulo = sumario.length > 0 
          ? `🍽️ ${sumario.join(' + ')}` 
          : `🍽️ Plan ${dia}`;

        // UID determinístico: YYYYMMDD-plandia → re-exportar sobrescribe
        const fechaYMD = formatearFechaICS(fechaEvento).slice(0, 8);
        const uid = `nutriplan-${fechaYMD}-plandia@nutriplan.local`;
        // SEQUENCE se deriva del timestamp Unix (segundos) dividido entre 60
        // así cada export en el mismo minuto es idempotente pero updates posteriores avanzan
        const seq = Math.floor(Date.now() / 60000) % 1000000;

        lineas.push(
          'BEGIN:VEVENT',
          `UID:${uid}`,
          `DTSTAMP:${formatearFechaICS(new Date())}`,
          `DTSTART:${formatearFechaICS(fechaEvento)}`,
          `DTEND:${formatearFechaICS(fechaFin)}`,
          `SUMMARY:${escaparICS(titulo)}`,
          `DESCRIPTION:${escaparICS(descripcion)}`,
          `SEQUENCE:${seq}`,
          `CATEGORIES:NutriPlan,Comida`,
          'END:VEVENT'
        );
      });
    });

    lineas.push('END:VCALENDAR');

    // iCalendar usa CRLF
    const contenido = lineas.join('\r\n');
    const fecha = new Date().toISOString().split('T')[0];
    descargarArchivo(contenido, `nutriplan-plan-${fecha}.ics`, 'text/calendar');
    return { dias: semanas.length * 7, semanas: semanas.length };
  }

  // ─────────────────────────────────────────────
  // 4.2.B: .ics detallado (5 eventos por día)
  // ─────────────────────────────────────────────
  function generarICSDetallado(planSemanal) {
    const HORARIOS = {
      desayuno: [8, 0, 20], snack_am: [11, 0, 10],
      almuerzo: [13, 30, 30], snack_pm: [17, 0, 10],
      cena: [20, 30, 30]
    };
    const lunesBase = proximoLunes();

    const lineas = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NutriPlan//Plan Detallado//ES',
      'CALSCALE:GREGORIAN',
      'X-WR-CALNAME:NutriPlan - Comidas',
      'X-WR-TIMEZONE:America/Santiago'
    ];

    const semanas = [];
    if (planSemanal._numSemanas) {
      for (let i = 1; i <= planSemanal._numSemanas; i++) {
        if (planSemanal['semana_' + i]) semanas.push(planSemanal['semana_' + i]);
      }
    } else {
      semanas.push(planSemanal);
    }

    const DIAS_ORDEN = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    semanas.forEach((semanaObj, idxSemana) => {
      DIAS_ORDEN.forEach((dia, idxDia) => {
        const comidasDia = semanaObj[dia];
        if (!comidasDia || typeof comidasDia !== 'object') return;

        TIPOS_COMIDA.forEach(tc => {
          const comida = comidasDia[tc.key];
          if (!comida || !comida.nombre) return;
          const [h, m, dur] = HORARIOS[tc.key];
          const fechaEvento = new Date(lunesBase);
          fechaEvento.setDate(lunesBase.getDate() + idxSemana * 7 + idxDia);
          fechaEvento.setHours(h, m, 0, 0);
          const fechaFin = new Date(fechaEvento);
          fechaFin.setMinutes(fechaFin.getMinutes() + dur);

          const kcal = comida.calorias_escaladas || comida.calorias_base || 0;
          let desc = `${comida.nombre}\\n${kcal} kcal`;
          if (comida.proteinas_escaladas) {
            desc += ` | P: ${comida.proteinas_escaladas}g | C: ${comida.carbohidratos_escalados}g | G: ${comida.grasas_escaladas}g`;
          }
          if (comida.tiempo_total_min) desc += `\\n⏱️ ${comida.tiempo_total_min} min`;

          // UID determinístico: YYYYMMDD-tipo → re-exportar sobrescribe
          const fechaYMD = formatearFechaICS(fechaEvento).slice(0, 8);
          const uid = `nutriplan-${fechaYMD}-${tc.key}@nutriplan.local`;
          const seq = Math.floor(Date.now() / 60000) % 1000000;

          lineas.push(
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${formatearFechaICS(new Date())}`,
            `DTSTART:${formatearFechaICS(fechaEvento)}`,
            `DTEND:${formatearFechaICS(fechaFin)}`,
            `SUMMARY:${escaparICS(tc.icon + ' ' + comida.nombre)}`,
            `DESCRIPTION:${escaparICS(desc)}`,
            `SEQUENCE:${seq}`,
            `CATEGORIES:NutriPlan,${tc.label}`,
            'END:VEVENT'
          );
        });
      });
    });

    lineas.push('END:VCALENDAR');
    const contenido = lineas.join('\r\n');
    const fecha = new Date().toISOString().split('T')[0];
    descargarArchivo(contenido, `nutriplan-plan-detallado-${fecha}.ics`, 'text/calendar');
  }

  // ─────────────────────────────────────────────
  // Fase 5.4: Export PDF del plan semanal (jsPDF via CDN)
  // ─────────────────────────────────────────────
  const JSPDF_URL = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
  let _jsPDFReady = null;

  function cargarJsPDF() {
    if (_jsPDFReady) return _jsPDFReady;
    _jsPDFReady = new Promise((resolve, reject) => {
      if (window.jspdf && window.jspdf.jsPDF) return resolve(window.jspdf.jsPDF);
      const s = document.createElement('script');
      s.src = JSPDF_URL;
      s.onload = () => resolve(window.jspdf.jsPDF);
      s.onerror = () => reject(new Error('No se pudo cargar jsPDF'));
      document.head.appendChild(s);
    });
    return _jsPDFReady;
  }

  const NOMBRES_COMIDA_PDF = {
    desayuno: 'Desayuno',
    snack_am: 'Snack AM',
    almuerzo: 'Almuerzo',
    snack_pm: 'Snack PM',
    cena: 'Cena'
  };
  const ORDEN_COMIDAS = ['desayuno', 'snack_am', 'almuerzo', 'snack_pm', 'cena'];
  const DIAS_PDF = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  async function exportarPlanPDF(planMulti, perfil, opciones) {
    opciones = opciones || {};
    const factorComensales = opciones.factorComensales || 1;
    const caloriasObj = (perfil && perfil.caloriasObjetivo) || 2000;

    const jsPDF = await cargarJsPDF();
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margen = 12;
    let y = margen;

    // Header
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageW, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('NutriPlan', margen, 14);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const fechaHoy = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`Plan semanal · ${fechaHoy}`, pageW - margen, 14, { align: 'right' });
    y = 28;

    // Perfil resumen
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    const resumenPerfil = `${caloriasObj} kcal/día · ${factorComensales !== 1 ? `×${factorComensales.toFixed(2)} comensales · ` : ''}${perfil?.sinGluten ? 'Sin gluten · ' : ''}${perfil?.sinLactosa ? 'Sin lactosa · ' : ''}${perfil?.vegetariano ? 'Vegetariano · ' : ''}${perfil?.modoSobras ? '♻️ Modo sobras' : ''}`.replace(/ · $/, '');
    doc.text(resumenPerfil, margen, y);
    y += 6;

    // Normalizar plan
    const plan = planMulti && planMulti._numSemanas ? planMulti : { _numSemanas: 1, semana_1: planMulti || {} };
    const numSemanas = plan._numSemanas || 1;

    // Colores por tipo de comida
    const COLORES = {
      desayuno: [251, 191, 36],    // amber
      snack_am: [134, 239, 172],   // green-300
      almuerzo: [96, 165, 250],    // blue-400
      snack_pm: [167, 139, 250],   // purple-400
      cena: [244, 114, 182]        // pink-400
    };

    for (let s = 1; s <= numSemanas; s++) {
      const semana = plan['semana_' + s];
      if (!semana) continue;

      if (s > 1 || y > 40) {
        if (y > pageH - 40) { doc.addPage(); y = margen; }
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(16, 185, 129);
      doc.text(`Semana ${s}`, margen, y + 6);
      y += 10;

      let totalKcalSem = 0, totalCostoSem = 0;

      DIAS_PDF.forEach(dia => {
        const comidasDia = semana[dia];
        if (!comidasDia) return;

        // Saltos de página
        if (y > pageH - 40) { doc.addPage(); y = margen; }

        // Día header
        doc.setFillColor(240, 253, 244);
        doc.rect(margen, y, pageW - margen * 2, 7, 'F');
        doc.setTextColor(6, 95, 70);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(dia, margen + 2, y + 5);
        let kcalDia = 0, costoDia = 0;
        y += 9;

        ORDEN_COMIDAS.forEach(tipo => {
          const comida = comidasDia[tipo];
          if (!comida) return;
          if (y > pageH - 15) { doc.addPage(); y = margen; }

          const kcal = comida.calorias_escaladas || 0;
          const costo = Math.round((comida.costo_clp || 0) * (comida.factor_escala || 1) * factorComensales);
          kcalDia += kcal;
          costoDia += costo;

          // Badge de tipo
          const c = COLORES[tipo] || [120, 120, 120];
          doc.setFillColor(c[0], c[1], c[2]);
          doc.rect(margen + 2, y - 3, 22, 4.5, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.text(NOMBRES_COMIDA_PDF[tipo] || tipo, margen + 13, y, { align: 'center' });

          // Nombre receta
          doc.setTextColor(40, 40, 40);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          const nombre = (comida.nombre || '').substring(0, 55);
          doc.text(nombre, margen + 26, y);

          // Macros + kcal + costo a la derecha
          const macros = `${kcal} kcal · P${comida.proteinas_escaladas || 0} C${comida.carbohidratos_escalados || 0} G${comida.grasas_escaladas || 0}${costo ? ` · $${costo.toLocaleString('es-CL')}` : ''}`;
          doc.setFontSize(7);
          doc.setTextColor(107, 114, 128);
          doc.text(macros, pageW - margen - 2, y, { align: 'right' });

          // Badges extras (Sobra, TM6)
          let xBadge = margen + 26 + doc.getTextWidth(nombre) + 2;
          if (comida.es_sobra) {
            doc.setFillColor(224, 231, 255);
            doc.setTextColor(67, 56, 202);
            doc.roundedRect(xBadge, y - 3, 10, 4, 1, 1, 'F');
            doc.text('Sobra', xBadge + 5, y, { align: 'center' });
            xBadge += 12;
          }
          if (comida.instrucciones_thermomix && comida.instrucciones_thermomix.length > 0) {
            doc.setFillColor(253, 230, 138);
            doc.setTextColor(180, 83, 9);
            doc.roundedRect(xBadge, y - 3, 8, 4, 1, 1, 'F');
            doc.text('TM6', xBadge + 4, y, { align: 'center' });
          }

          y += 5.5;
        });

        // Total del día
        doc.setDrawColor(229, 231, 235);
        doc.line(margen + 2, y, pageW - margen - 2, y);
        doc.setFontSize(7);
        doc.setTextColor(107, 114, 128);
        doc.text(`Total día: ${kcalDia} kcal${costoDia ? ` · $${costoDia.toLocaleString('es-CL')}` : ''}`, pageW - margen - 2, y + 3, { align: 'right' });
        y += 6;
        totalKcalSem += kcalDia;
        totalCostoSem += costoDia;
      });

      // Total semana
      if (y > pageH - 20) { doc.addPage(); y = margen; }
      doc.setFillColor(16, 185, 129);
      doc.rect(margen, y, pageW - margen * 2, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Total Semana ${s}: ${totalKcalSem.toLocaleString('es-CL')} kcal · ${totalCostoSem > 0 ? '$' + totalCostoSem.toLocaleString('es-CL') + ' CLP' : ''}`, margen + 2, y + 5);
      y += 12;
    }

    // Footer de todas las páginas
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text(`NutriPlan · Página ${i} de ${totalPages}`, pageW / 2, pageH - 5, { align: 'center' });
    }

    const fecha = new Date().toISOString().split('T')[0];
    doc.save(`nutriplan-plan-${fecha}.pdf`);
    return { paginas: totalPages };
  }

  window.exports = {
    listaCSV: exportarListaCSV,
    textoSupermercado: generarTextoSupermercado,
    textoKeep: generarTextoKeep,
    icsCompacto: generarICSCompacto,
    icsDetallado: generarICSDetallado,
    planPDF: exportarPlanPDF
  };

  console.log('[Exports] Módulo cargado (CSV + .ics + PDF)');
})();
