# Dimensions

Dimension entities annotate distances, angles, and coordinates in a drawing. All dimension types share common properties from the `Dimension` base class and have specific points that control their geometry.

## Common dimension properties

| Property | Type | Description |
|---|---|---|
| `definitionPoint` | `XYZ` | Definition point (green in diagrams) |
| `insertionPoint` | `XYZ` | Text insertion point (cyan in diagrams) |
| `style` | `DimensionStyle` | Dimension style controlling appearance |
| `text` | `string` | Override text (empty = automatic measurement) |
| `rotation` | `number` | Text rotation angle |

## Aligned

![image](./media/dimension-aligned-points.png)

| Color | Property |
|---|---|
| RED | `firstPoint` |
| YELLOW | `secondPoint` |
| GREEN | `definitionPoint` |
| CYAN | `insertionPoint` |

## Linear

![image](./media/dimension-linear-points.png)

| Color | Property |
|---|---|
| RED | `firstPoint` |
| YELLOW | `secondPoint` |
| GREEN | `definitionPoint` |
| CYAN | `insertionPoint` |

## Ordinate

![image](./media/dimension-ordinate-points.png)

| Color | Property |
|---|---|
| RED | `featureLocation` |
| YELLOW | `leaderEndpoint` |
| GREEN | `definitionPoint` |
| CYAN | `insertionPoint` |

## Diameter

![image](./media/dimension-diameter-points.png)

| Color | Property |
|---|---|
| RED | `angleVertex` |
| YELLOW | `center` |
| GREEN | `definitionPoint` |
| CYAN | `insertionPoint` |

## Radius

![image](./media/dimension-radius-points.png)

| Color | Property |
|---|---|
| RED | `angleVertex` |
| GREEN | `definitionPoint` |
| CYAN | `insertionPoint` |

## Angular2Line

![image](./media/dimension-angular2line-points.png)

| Color | Property |
|---|---|
| RED | `firstPoint` |
| YELLOW | `secondPoint` |
| BLUE | `angleVertex` |
| MAGENTA | `dimensionArc` |
| GREEN | `definitionPoint` |
| CYAN | `insertionPoint` |

## Angular3Pt

![image](./media/dimension-angular3pt-points.png)

| Color | Property |
|---|---|
| RED | `firstPoint` |
| YELLOW | `secondPoint` |
| BLUE | `angleVertex` |
| GREEN | `definitionPoint` |
| CYAN | `insertionPoint` |
