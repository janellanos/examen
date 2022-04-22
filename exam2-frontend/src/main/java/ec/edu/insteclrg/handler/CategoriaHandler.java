package ec.edu.insteclrg.handler;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpMethod;

import ec.edu.insteclrg.dto.ApiResponseDTO;
import ec.edu.insteclrg.dto.CategoriaDTO;

public class CategoriaHandler extends ApiHandler<CategoriaDTO> {
	private static final long serialVersionUID = 1L;
	
	private String ruta;

	public CategoriaHandler() {
		try {
			File doc = new File(getClass().getClassLoader().getResource("categoria.txt").getFile());
			BufferedReader obj = new BufferedReader(new FileReader(doc));
			ruta = obj.readLine();
		} catch (Exception e) {

		}
	}

	public ApiResponseDTO<CategoriaDTO> guardar(CategoriaDTO dto) {
		String remotePath = ruta + "guardar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.POST, remotePath);
		ErrorJsonHandler<CategoriaDTO> jsonHandler = new ErrorJsonHandler<CategoriaDTO>(dto);
		ApiResponseDTO<CategoriaDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;

	}

	public ApiResponseDTO<CategoriaDTO> actualizar(CategoriaDTO dto) {
		String remotePath = ruta + "actualizar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.PUT, remotePath);
		ErrorJsonHandler<CategoriaDTO> jsonHandler = new ErrorJsonHandler<CategoriaDTO>(dto);
		ApiResponseDTO<CategoriaDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;
	}


	public ApiResponseDTO<CategoriaDTO> eliminar(Long id) {
		CategoriaDTO dto = new CategoriaDTO();
		String remotePath = ruta + id+"/eliminar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.DELETE, remotePath);
		ErrorJsonHandler<CategoriaDTO> jsonHandler = new ErrorJsonHandler<CategoriaDTO>(dto);
		ApiResponseDTO<CategoriaDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;
	}

	public ApiResponseDTO<CategoriaDTO> buscarPorId(Long id) {
		CategoriaDTO dto = new CategoriaDTO();
		String remotePath = ruta + id+"/buscar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.GET, remotePath);
		ErrorJsonHandler<CategoriaDTO> jsonHandler = new ErrorJsonHandler<CategoriaDTO>(dto);
		ApiResponseDTO<CategoriaDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;

	}

	public ApiResponseDTO<List<CategoriaDTO>> buscarTodo() {
		List<CategoriaDTO> dto = new ArrayList<>();
		String remotePath = ruta + "listar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.GET, remotePath);
		ErrorJsonHandler<List<CategoriaDTO>> jsonHandler = new ErrorJsonHandler<List<CategoriaDTO>>(dto);
		ApiResponseDTO<List<CategoriaDTO>> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;

	}
}
