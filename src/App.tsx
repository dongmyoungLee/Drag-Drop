import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

function App() {
  const onDragEnd = () => {}
  return (
    //onDragEnd = 유저가 드래그를 끝낸 시점에 불려지는 함수
    <DragDropContext onDragEnd={onDragEnd}>
       <div>
         {/* Droppable 무언가를 dnd할수있는, 해오는 영역, 드래그 할 영역 자식으로 함수 */}
          <Droppable droppableId="one">
           {(magic) => (
            <ul ref={magic.innerRef} {...magic.droppableProps}>
              {/*Draggable : Droppable 안에서 드래그 하는 영역 */}
                <Draggable draggableId="first" index={0}>
                  {(magic) => (
                    <li 
                      ref={magic.innerRef}
                      {...magic.draggableProps}
                    >
                      <span {...magic.dragHandleProps}>★</span>
                      One
                    </li>
                  )}
                </Draggable>  
                <Draggable draggableId="second" index={1}>
                  {(magic) => (
                      <li 
                        ref={magic.innerRef}
                        {...magic.draggableProps}
                        {...magic.dragHandleProps}>
                        Two
                      </li>
                  )}
                </Draggable>  
            </ul>
           )}
          </Droppable>
       </div>
    </DragDropContext>
  )
}


export default App;