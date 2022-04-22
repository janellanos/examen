package ec.edu.insteclrg.handler;

import java.io.Serializable;

import org.primefaces.shaded.json.JSONObject;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import ec.edu.insteclrg.common.AppException;
import ec.edu.insteclrg.dto.ApiResponseDTO;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ErrorJsonHandler<T> implements Serializable {

	private static final long serialVersionUID = 1L;

	private T entidadDto;

	@SuppressWarnings("unchecked")
	public ApiResponseDTO<T> getServerResponse(String jsonString) {
		if (entidadDto == null || jsonString == null)
			return null;
		T objectResult = entidadDto;
		String error = null;
		Boolean success = false;
		ApiResponseDTO<T> remoteServerResponseDTO = new ApiResponseDTO<T>(false, entidadDto, null);
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode jsonNode = null;
		try {
			jsonNode = objectMapper.readTree(jsonString);
			success = jsonNode.path("success").asBoolean();
			if (success) {
				objectResult = (T) objectMapper.convertValue(jsonNode.path("result"), objectResult.getClass());
				if (objectResult != null)
					entidadDto = objectResult;
			} else {
				error = jsonNode.path("error").asText();
				if (error.isEmpty()) {
					JSONObject json = new JSONObject(jsonNode.path("result").toString());
					error = json.getString("message");
				} else {
					String error2 = jsonNode.path("exception").asText();
					if (!error2.isEmpty()) {
						error += ". exception:" + error2;
					}
					error2 = jsonNode.path("message").asText();
					if (!error2.isEmpty()) {
						error += ". message:" + error2;
					}
				}
			}
		} catch (JsonProcessingException e) {
			new AppException("Error en las peticiones al servidor remoto");
		}
		remoteServerResponseDTO.setError(error);
		remoteServerResponseDTO.setResult(entidadDto);
		remoteServerResponseDTO.setSuccess(success);
		return remoteServerResponseDTO;

	}
}
