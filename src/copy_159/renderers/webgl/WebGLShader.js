/**
 * @author mrdoob / http://mrdoob.com/
 */

function WebGLShader( gl, type, string ) {

	var shader = gl.createShader( type );

	gl.shaderSource( shader, string );
	gl.compileShader( shader );

	return shader;

}

export { WebGLShader };

export const unique_id_58808 = 58808;