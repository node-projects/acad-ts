export enum ZeroHandling {
	SuppressZeroFeetAndInches = 0,
	ShowZeroFeetAndInches = 1,
	ShowZeroFeetSuppressZeroInches = 2,
	SuppressZeroFeetShowZeroInches = 3,
	SuppressDecimalLeadingZeroes = 4,
	SuppressDecimalTrailingZeroes = 8,
	SuppressDecimalLeadingAndTrailingZeroes = 12,
}

export enum AngularZeroHandling {
	DisplayAll = 0,
	SuppressLeadingZeroes = 1,
	SupressTrailingZeroes = 2,
	SupressAll = 3,
}
