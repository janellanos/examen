package ec.edu.insteclrg.common;

import javax.faces.application.FacesMessage;
import javax.faces.application.FacesMessage.Severity;

public enum MensajesTipo {
	INFORMACION(FacesMessage.SEVERITY_INFO),
	ERROR(FacesMessage.SEVERITY_ERROR),
	ADVERTENCIA(FacesMessage.SEVERITY_WARN),
	FATAL(FacesMessage.SEVERITY_FATAL);

	private Severity description;
	
	public Severity getDescription() {
		return description;
	}

	private MensajesTipo(Severity severityInfo) {
		this.description = severityInfo;
	}
	
	@Override
	public String toString() {
		return description.toString();
	}
}
