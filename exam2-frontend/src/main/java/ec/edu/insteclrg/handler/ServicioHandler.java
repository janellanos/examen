package ec.edu.insteclrg.handler;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpMethod;

import ec.edu.insteclrg.dto.ApiResponseDTO;
import ec.edu.insteclrg.dto.ServicioDTO;
import ec.edu.insteclrg.dto.ServicioDTO;

public class ServicioHandler extends ApiHandler<ServicioDTO> {


	private static final long serialVersionUID = 1L;
	
	private String ruta;

	public ServicioHandler() {
		try {
			File doc = new File(getClass().getClassLoader().getResource("service.txt").getFile());
			BufferedReader obj = new BufferedReader(new FileReader(doc));
			ruta = obj.readLine();
		} catch (Exception e) {

		}
	}

	public ApiResponseDTO<ServicioDTO> guardar(ServicioDTO dto) {
		String remotePath = ruta + "guardar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.POST, remotePath);
		ErrorJsonHandler<ServicioDTO> jsonHandler = new ErrorJsonHandler<ServicioDTO>(dto);
		ApiResponseDTO<ServicioDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;

	}

	public ApiResponseDTO<ServicioDTO> actualizar(ServicioDTO dto) {
		String remotePath = ruta + "actualizar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.PUT, remotePath);
		ErrorJsonHandler<ServicioDTO> jsonHandler = new ErrorJsonHandler<ServicioDTO>(dto);
		ApiResponseDTO<ServicioDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;
	}


	public ApiResponseDTO<ServicioDTO> eliminar(Long id) {
		ServicioDTO dto = new ServicioDTO();
		String remotePath = ruta + id+"/eliminar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.DELETE, remotePath);
		ErrorJsonHandler<ServicioDTO> jsonHandler = new ErrorJsonHandler<ServicioDTO>(dto);
		ApiResponseDTO<ServicioDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;
	}

	public ApiResponseDTO<ServicioDTO> buscarPorId(Long id) {
		ServicioDTO dto = new ServicioDTO();
		String remotePath = ruta + id+"/buscar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.GET, remotePath);
		ErrorJsonHandler<ServicioDTO> jsonHandler = new ErrorJsonHandler<ServicioDTO>(dto);
		ApiResponseDTO<ServicioDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;

	}

	public ApiResponseDTO<List<ServicioDTO>> buscarTodo() {
		List<ServicioDTO> dto = new ArrayList<>();
		String remotePath = ruta + "listar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.GET, remotePath);
		ErrorJsonHandler<List<ServicioDTO>> jsonHandler = new ErrorJsonHandler<List<ServicioDTO>>(dto);
		ApiResponseDTO<List<ServicioDTO>> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;

	}
}
