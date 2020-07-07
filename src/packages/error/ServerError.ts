class ServerError extends Error {
  private status: number;
  private code: string;
  constructor(status: number, code: string, message?: string) {
    super(message);

    this.status = status;
    this.code = code;
  }
  getResponse() {
    const { status, code, message } = this;

    return {
      status,
      code,
      message,
    };
  }
  getStatus() {
    return this.status;
  }
}

export default ServerError;
