export default /* glsl */`
#if defined( TONE_MAPPING )

	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );

#endif
`;

export const unique_id_70585 = 70585;