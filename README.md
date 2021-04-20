# NgCoordrag

`ng-coordrag` is a simple library helping you to retrieve coordinate of the element attached to the `appCoordrag` directive as the element is held down and dragged.

## Configuration Options
| Option                      | Default | Description                 |
| ---                         | ---     | ---                         |
| appMousemoveOnMousedown     | false   | enable the directive or not |

## Outputs
| Output            | Emitted expressions | Description                          |
| ---               | ---                 | ---                                  |
| onEleIsMousedDown | MouseEvent          | Emit when the element is moused down |
| onEleIsMousedMove | MouseEvent          | Emit when the element is moused move |
| onEleIsMousedUp   | MouseEvent          | Emit when the element is moused up   |
