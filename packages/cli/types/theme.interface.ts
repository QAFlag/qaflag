export interface Theme {
  suite: {
    pass: {
      bgColor: string;
      textColor: string;
      subtextColor: string;
    };
    fail: {
      bgColor: string;
      textColor: string;
    };
    content: {
      bgColor: string;
      textColor: string;
    };
  };
  step: {
    bgColor: string;
    textColor: string;
  };
  scenario: {
    head: {
      bgColor: string;
      textColor: string;
      subtextColor: string;
    };
    content: {
      bgColor: string;
      textColor: string;
      subtextcolor: string;
      pass: {
        marker: string;
        markerColor: string;
        textColor: string;
      };
      fail: {
        marker: string;
        markerColor: string;
        textColor: string;
      };
      optionalFail: {
        marker: string;
        markerColor: string;
        textColor: string;
      };
    };
  };
}
