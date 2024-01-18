export const actualizarCuotas = async ({
  infoClientes,
  db,
  updateDoc,
  doc,
  usuarioRuta,
}) => {
  if (infoClientes) {
    const batch = [];

    // Utilizar una variable temporal para acumular los cambios
    let infoClientesActualizado = infoClientes.map((cliente) => {
      const { abono, fechaUltimoAbono, actualizado } = cliente;
      const fechaActual = new Date();
      const fechaUltimoAbonoDate = new Date(fechaUltimoAbono);
      const ultimoReset = new Date(actualizado);
      fechaActual.setHours(0, 0, 0, 0);
      fechaUltimoAbonoDate.setHours(0, 0, 0, 0);
      ultimoReset.setHours(0, 0, 0, 0);
      const noEsHoy = fechaUltimoAbonoDate < fechaActual;
      const actualizadoHoy = ultimoReset.getTime() === fechaActual.getTime();

      if (abono === 0 && noEsHoy && !actualizadoHoy) {
        const cuotasAtrasadasActualizadas = cliente.cuotasAtrasadas + 1;
        batch.push(
          updateDoc(
            doc(
              db,
              "admin_users",
              usuarioRuta.adminUid,
              "rutas",
              usuarioRuta.uid,
              "clientes",
              cliente.uid
            ),
            {
              cuotasAtrasadas: cuotasAtrasadasActualizadas,
              actualizado: new Date().toDateString(),
            }
          )
        );
        return { ...cliente, cuotasAtrasadas: cuotasAtrasadasActualizadas };
      } else if (abono > 0 && noEsHoy && !actualizadoHoy) {
        batch.push(
          updateDoc(
            doc(
              db,
              "admin_users",
              usuarioRuta.adminUid,
              "rutas",
              usuarioRuta.uid,
              "clientes",
              cliente.uid
            ),
            {
              abono: 0,
              actualizado: new Date().toDateString(),
            }
          )
        );
        return { ...cliente, abono: 0 };
      }

      return cliente;
    });
    // Actualizar en Firebase
    await Promise.all(batch);

    // Actualizar localmente solo después de completar el bucle
    return infoClientesActualizado;
  }
};
