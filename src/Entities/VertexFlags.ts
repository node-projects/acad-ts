export enum VertexFlags {
	Default = 0,
	CurveFittingExtraVertex = 1,
	CurveFitTangent = 2,
	NotUsed = 4,
	SplineVertexFromSplineFitting = 8,
	SplineFrameControlPoint = 16,
	PolylineVertex3D = 32,
	PolygonMesh3D = 64,
	PolyfaceMeshVertex = 128,
}
