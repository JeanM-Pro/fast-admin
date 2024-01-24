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
      const { abono, fechaUltimoAbono, actualizado, formaDePago } = cliente;
      const fechaActualNueva = new Date();
      const fechaUltimoAbonoDate = new Date(fechaUltimoAbono);
      const ultimoReset = new Date(actualizado);
      fechaActualNueva.setHours(0, 0, 0, 0);
      fechaUltimoAbonoDate.setHours(0, 0, 0, 0);
      ultimoReset.setHours(0, 0, 0, 0);
      const noEsHoy = fechaUltimoAbonoDate < fechaActualNueva;
      const actualizadoHoy =
        ultimoReset.getTime() === fechaActualNueva.getTime();

      if (abono === 0 && noEsHoy && !actualizadoHoy) {
        let cuotasAtrasadasActualizadas;

        if (formaDePago === "semanal" || formaDePago === "mensual") {
          cuotasAtrasadasActualizadas = 0;
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
        } else {
          cuotasAtrasadasActualizadas = cliente.cuotasAtrasadas + 1;
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
        }
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
