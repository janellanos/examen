package ec.edu.insteclrg.config;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Configuration;

@Configuration
//@Profile("dev")
public class ConfigureJSFContextParameters implements ServletContextInitializer {
	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {

		servletContext.setInitParameter("javax.faces.DEFAULT_SUFFIX", ".xhtml");
		servletContext.setInitParameter("javax.faces.PARTIAL_STATE_SAVING_METHOD", "true");
		servletContext.setInitParameter("javax.faces.PROJECT_STAGE", "Development");
		servletContext.setInitParameter("facelets.DEVELOPMENT", "true");
		servletContext.setInitParameter("javax.faces.FACELETS_REFRESH_PERIOD", "1");

		servletContext.setInitParameter("com.sun.faces.forceLoadConfiguration", Boolean.TRUE.toString());
		servletContext.setInitParameter("javax.faces.FACELETS_SKIP_COMMENTS", "true");

		servletContext.setInitParameter("primefaces.CLIENT_SIDE_VALIDATION", "true");
		servletContext.setInitParameter("primefaces.THEME", "flick");// humanity, flick, bootstrap;
		servletContext.setInitParameter("listener-class", "com.sun.faces.config.ConfigureListener");

		//servletContext.setInitParameter("javax.faces.FACELETS_SKIP_COMMENTS", "true");
		//servletContext.setInitParameter("com.sun.faces.expressionFactory", "com.sun.el.ExpressionFactoryImpl");
		
		servletContext.setInitParameter("primeFacesFileUploadFilter", "org.primefaces.webapp.filter.FileUploadFilter");
		servletContext.setInitParameter("primeFacesFileUploadFilter", "facesServlet");
		servletContext.setInitParameter("primefaces.UPLOADER", "commons");
		
		// servletContext.setInitParameter("allowCasualMultipartParsing", "true");
		// servletContext.setInitParameter("primefaces.UPLOADER", "commons");
		// servletContext.setInitParameter("PrimeFaces FileUpload Filter",
		// "org.primefaces.webapp.filter.FileUploadFilter");
		// servletContext.setInitParameter("PrimeFaces FileUpload Filter", "Faces
		// Servlet");

	}
}
