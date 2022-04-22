package ec.edu.insteclrg.utils;

import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;

import org.primefaces.PrimeFaces;

import ec.edu.insteclrg.common.MensajesTipo;

public class Mensajes {

	public static void addMsg(MensajesTipo severity, String mensaje) {
		FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(severity.getDescription(), mensaje, null));
		PrimeFaces.current().ajax().update("form:mensajes");
	}
}
