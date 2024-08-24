export default /* glsl */`
#ifdef USE_DISPLACEMENTMAP

	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );

#endif
`;

export const unique_id_72375 = 72375;