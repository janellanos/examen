package ec.edu.insteclrg.common;

public class ResourceNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ResourceNotFoundException(String object) {
		super(String.format("%s no se encuentra registrado o estatus inválido para esta acción", object));
	}

}