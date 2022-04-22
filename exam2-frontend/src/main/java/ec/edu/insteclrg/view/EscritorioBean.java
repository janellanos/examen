package ec.edu.insteclrg.view;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@Scope("view")
public class EscritorioBean {

	private String texto;

	@PostConstruct
	public void init() {
		texto = "IST Luis Rogerio González";
	}

}
