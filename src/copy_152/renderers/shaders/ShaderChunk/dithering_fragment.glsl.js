export default /* glsl */`
#ifdef DITHERING

	gl_FragColor.rgb = dithering( gl_FragColor.rgb );

#endif
`;

export const unique_id_56096 = 56096;