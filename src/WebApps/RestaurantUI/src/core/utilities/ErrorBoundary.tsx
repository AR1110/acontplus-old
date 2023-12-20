import React, { Component } from "react";

interface Props {
  children: React.ReactNode;
  fallBackComponent: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override componentDidCatch(error: Error, errorInfo: any) {  
    console.log(error, errorInfo)  // You can also log the error to an error reporting service
      // logErrorToMyService(error, errorInfo);
      
  }

  static getDerivedStateFromError(error: Error) {
    console.log(error) // You can also log the error to an error
    return {
      hasError: true,
    };
  }

  override render() { 
    if (this.state.hasError) {
      return this.props.fallBackComponent;
    }
    return <>{this.props.children}</>
  }
}
 