export enum CadValueType {
	Unknown = 0,
	Long = 1,
	Double = 2,
	String = 4,
	Date = 8,
	Point2D = 0x10,
	Point3D = 0x20,
	Handle = 0x40,
	Buffer = 0x80,
	ResultBuffer = 0x100,
	General = 0x200,
}
