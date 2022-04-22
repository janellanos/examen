package ec.edu.insteclrg.handler;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpMethod;

import ec.edu.insteclrg.dto.ApiResponseDTO;
import ec.edu.insteclrg.dto.ProductoDTO;

public class ProductoHandler extends ApiHandler<ProductoDTO> {

	
	private static final long serialVersionUID = 1L;
	
	private String ruta;

	public ProductoHandler() {
		try {
			File doc = new File(getClass().getClassLoader().getResource("product.txt").getFile());
			BufferedReader obj = new BufferedReader(new FileReader(doc));
			ruta = obj.readLine();
		} catch (Exception e) {

		}
	}

	public ApiResponseDTO<ProductoDTO> guardar(ProductoDTO dto) {
		String remotePath = ruta + "guardar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.POST, remotePath);
		ErrorJsonHandler<ProductoDTO> jsonHandler = new ErrorJsonHandler<ProductoDTO>(dto);
		ApiResponseDTO<ProductoDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;

	}

	public ApiResponseDTO<ProductoDTO> actualizar(ProductoDTO dto) {
		String remotePath = ruta + "actualizar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.PUT, remotePath);
		ErrorJsonHandler<ProductoDTO> jsonHandler = new ErrorJsonHandler<ProductoDTO>(dto);
		ApiResponseDTO<ProductoDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;
	}


	public ApiResponseDTO<ProductoDTO> eliminar(Long id) {
		ProductoDTO dto = new ProductoDTO();
		String remotePath = ruta + id+"/eliminar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.DELETE, remotePath);
		ErrorJsonHandler<ProductoDTO> jsonHandler = new ErrorJsonHandler<ProductoDTO>(dto);
		ApiResponseDTO<ProductoDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;
	}

	public ApiResponseDTO<ProductoDTO> buscarPorId(Long id) {
		ProductoDTO dto = new ProductoDTO();
		String remotePath = ruta + id+"/buscar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.GET, remotePath);
		ErrorJsonHandler<ProductoDTO> jsonHandler = new ErrorJsonHandler<ProductoDTO>(dto);
		ApiResponseDTO<ProductoDTO> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;

	}

	public ApiResponseDTO<List<ProductoDTO>> buscarTodo() {
		List<ProductoDTO> dto = new ArrayList<>();
		String remotePath = ruta + "listar";
		String responseJsonStr = super.consumeREST(dto, HttpMethod.GET, remotePath);
		ErrorJsonHandler<List<ProductoDTO>> jsonHandler = new ErrorJsonHandler<List<ProductoDTO>>(dto);
		ApiResponseDTO<List<ProductoDTO>> response = jsonHandler.getServerResponse(responseJsonStr);
		return response;

	}
}
