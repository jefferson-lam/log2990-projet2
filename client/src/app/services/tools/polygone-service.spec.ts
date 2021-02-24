import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygoneService } from './polygone-service';

// tslint:disable:max-file-line-count
// tslint:disable:no-any
describe('PolygoneService', () => {
  let service: PolygoneService;
  let mouseEvent: MouseEvent;
  let canvasTestHelper: CanvasTestHelper;
  let drawServiceSpy: jasmine.SpyObj<DrawingService>;

  let baseCtxStub: CanvasRenderingContext2D;
  let previewCtxStub: CanvasRenderingContext2D;
  let drawPolygoneSpy: jasmine.Spy<any>;

  beforeEach(() => {
    drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
    TestBed.configureTestingModule({
      providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
    });
    canvasTestHelper = TestBed.inject(CanvasTestHelper);
    baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    service = TestBed.inject(PolygoneService);
    drawPolygoneSpy = spyOn<any>(service, 'drawPolygone').and.callThrough();
    // Configuration of spy of service
    // tslint:disable:no-string-literal
    service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
    service['drawingService'].previewCtx = previewCtxStub;

    mouseEvent = {
      offsetX: 25,
      offsetY: 40,
      button: MouseConstants.MouseButton.Left,
    } as MouseEvent;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onMouseDown should set mouseDownCoord to correct position', () => {
    const expectedResult: Vec2 = { x: 25, y: 40 };
    service.onMouseDown(mouseEvent);
    expect(service.mouseDownCoord).toEqual(expectedResult);
  });

  it('onMouseDown should set mouseDown property to true on left click', () => {
    service.onMouseDown(mouseEvent);
    expect(service.mouseDown).toEqual(true);
  });

  it('onMouseDown should set mouseDown property to false on right click', () => {
    const mouseEventRClick = {
      offsetX: 25,
      offsetY: 25,
      button: MouseConstants.MouseButton.Right,
    } as MouseEvent;
    service.onMouseDown(mouseEventRClick);
    expect(service.mouseDown).toEqual(false);
  });

  it('onMouseUp should call drawPolygone if mouse was already down', () => {
    service.mouseDownCoord = { x: 0, y: 0 };
    service.mouseDown = true;
    service.onMouseUp(mouseEvent);
    expect(drawPolygoneSpy).toHaveBeenCalled();
  });

  it('onMouseUp should not call drawPolygone if mouse was not already down', () => {
    service.mouseDown = false;
    service.mouseDownCoord = { x: 0, y: 0 };
    service.onMouseUp(mouseEvent);
    expect(drawPolygoneSpy).not.toHaveBeenCalled();
  });

  it('onMouseMove should call drawPolygone if mouse was already down', () => {
    service.mouseDownCoord = { x: 0, y: 0 };
    service.mouseDown = true;
    service.onMouseMove(mouseEvent);
    expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    expect(drawPolygoneSpy).toHaveBeenCalled();
  });

  it('onMouseMove should not call drawPolygone if mouse was not already down', () => {
    service.mouseDownCoord = { x: 0, y: 0 };
    service.mouseDown = false;
    service.onMouseMove(mouseEvent);
    expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    expect(drawPolygoneSpy).not.toHaveBeenCalled();
  });

  it('onMouseLeave should call drawPolygone if mouse was pressed', () => {
    service.mouseDownCoord = { x: 0, y: 0 };
    service.mouseDown = true;
    service.onMouseLeave(mouseEvent);
    expect(drawPolygoneSpy).toHaveBeenCalled();
  });

  it('onMouseLeave should not call drawPolygone if mouse was not pressed', () => {
    service.mouseDownCoord = { x: 0, y: 0 };
    service.mouseDown = false;
    service.onMouseLeave(mouseEvent);
    expect(drawPolygoneSpy).not.toHaveBeenCalled();
  });

  it('onMouseEnter should make service.mouseDown true if left mouse was pressed and mouse was pressed before leaving', () => {
    const mouseEnterEvent = {
      offsetX: 25,
      offsetY: 40,
      buttons: MouseConstants.PRIMARY_BUTTON,
    } as MouseEvent;
    service.mouseDown = true;
    service.onMouseEnter(mouseEnterEvent);
    expect(service.mouseDown).toEqual(true);
  });

  it('onMouseEnter should make service.mouseDown false if left mouse was pressed and mouse was not pressed before leaving', () => {
    const mouseEnterEvent = {
      offsetX: 25,
      offsetY: 40,
      buttons: 1,
    } as MouseEvent;
    service.mouseDown = false;
    service.onMouseEnter(mouseEnterEvent);
    expect(service.mouseDown).toEqual(false);
  });

  it('onMouseEnter should make service.mouseDown false if left mouse was not pressed and mouse was not pressed before leaving', () => {
    const mouseEnterEvent = {
      offsetX: 25,
      offsetY: 40,
      buttons: 0,
    } as MouseEvent;
    service.mouseDown = false;
    service.onMouseEnter(mouseEnterEvent);
    expect(service.mouseDown).toEqual(false);
  });

  it('setLineWidth should change size of lineWidth if within min and max width allowed', () => {
    const RANDOM_TEST_WIDTH = 10;
    service.setLineWidth(RANDOM_TEST_WIDTH);
    expect(service.lineWidth).toEqual(RANDOM_TEST_WIDTH);
  });

  it('setLineWidth should change size of lineWidth if within min and max width allowed', () => {
    const RANDOM_TEST_COUNT = 10;
    service.setSidesCount(RANDOM_TEST_COUNT);
    expect(service.initNumberSides).toEqual(RANDOM_TEST_COUNT);
  });

  it('setFillMode should change to FILL ONLY mode', () => {
    const EXPECTED_FILL_MODE = ToolConstants.FillMode.FILL_ONLY;
    service.setFillMode(EXPECTED_FILL_MODE);
    expect(service.fillMode).toEqual(EXPECTED_FILL_MODE);
  });

  it('setFillMode should change to OUTLINE mode', () => {
    const EXPECTED_FILL_MODE = ToolConstants.FillMode.OUTLINE;
    service.setFillMode(EXPECTED_FILL_MODE);
    expect(service.fillMode).toEqual(EXPECTED_FILL_MODE);
  });

  it('setFillMode should change to OUTLINE_FILL ONLY mode', () => {
    const EXPECTED_FILL_MODE = ToolConstants.FillMode.OUTLINE_FILL;
    service.setFillMode(EXPECTED_FILL_MODE);
    expect(service.fillMode).toEqual(EXPECTED_FILL_MODE);
  });

  it('setPrimaryColor should change primary color to wanted color', () => {
    const EXPECTED_RANDOM_COLOR = 'blue';
    service.setPrimaryColor(EXPECTED_RANDOM_COLOR);
    expect(service.primaryColor).toEqual(EXPECTED_RANDOM_COLOR);
  });

  it('setSecondaryColor should change secondary color to wanted color', () => {
    const EXPECTED_RANDOM_COLOR = 'green';
    service.setSecondaryColor(EXPECTED_RANDOM_COLOR);
    expect(service.secondaryColor).toEqual(EXPECTED_RANDOM_COLOR);
  });
});
