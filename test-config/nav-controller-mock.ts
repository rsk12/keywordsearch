export interface NavMockAction {
  page: string;
  params?: any;
}

export class NavControllerMock {
  stack: NavMockAction[] = [];

  push(page: string, params?: any) {
    this.stack.push({
        page,
        params
    })
  }

  peekForTest(): NavMockAction {
    return this.stack[this.stack.length - 1];
  }
}
